---
title: NHibernate QueryOver examples using the C# library
subTitle: QueryOver is a powerful wrapper for the NHibernate ORM Criteria API. It is type-safe with a familiar syntax to Lambda expressions and LINQ. This post covers a nice range of real-world usage examples.
cover: AdobeStock_125269092.jpeg
---

Real world usage examples, showcasing the power of the strongly typed database query language NHibernate QueryOver.

If you'd like to read up more about the benefits of NHibernate, ORM and QueryOver generally please read the following articles.

* [QueryOver series by Andrew Whitaker](http://www.andrewwhitaker.com/queryover-series/)
* [Official NHibernate documentation](http://nhibernate.info/doc/)

Examples

### 1. ReadOnly usage

ReadOnly is a safety measure that you can apply to NHibernate queries. I highly recommend you use this property when you do not intend to perform database updates/inserts. Take the following example:

``` c#
Customer customerAndOrders =
            NHibernateSession.QueryOver<Customer>()
            .Fetch(n => n.Orders).Eager
            .Where(n => n.CustomerId == navbarId)
            .SingleOrDefault()
            .ReadOnly(); //this is where you set ReadOnly()

//modifications to the objects will NOT be automatically propagated to the database
NastyMethodThatModifiesData(customerAndOrders);
NastyMethodThatModifiesData(customerAndOrders.Orders);
```

There are some caveats to ReadOnly in NHibernate, I recommend that you read more on the subject [here](http://nhibernate.info/doc/nhibernate-reference/readonly.html).

### 2. Transforming

Using the inbuilt DistinctRootEntity transformer, we can safely transform duplicate rows originating from left joins (one to many or many to many). The results after the transform are correctly nested C# objects.

``` c#
IList<NavBarItem> navBarItemsForNavBar =
        NHibernateSession.QueryOver<NavbarItem>()
        .Where(n => n.NavbarId == navbarId)
        .Fetch(n => n.Section).Eager //one section per navBarItem
        .Fetch(n => n.Images).Eager //multiple images per navBarItem
        .TransformUsing(Transformers.DistinctRootEntity) //this is the transform
        .ReadOnly().List();

//The client actually wants to sort the images within each NavBarItem entry, in this case we sort this nested content in code.
//ReadOnly() is set already for safety to prevent any updates/inserts occurring as a result of the sorting
navBarList.ForEach(ni => ni.Images = ni.Images.OrderBy(c => c.Position).ToList());
```

### 3. Projecting and inner joins with multiple criteria/conditions

This below query shows both of the following.

* Inner joins with additional conditions, part of join criteria. In this example, we are getting all the GroupTests and Reviews by just the reviewIds
* Projecting/selecting only a few properties instead many unneeded columns, using the AliasToBean transformer

``` c#
GroupTestDo groupTestDo = null;
ReviewDo reviewDo = null;
return
    NHibernateSession.QueryOver<GroupTestReviewDo>()
        .Inner.JoinAlias(r => r.Reviews, () => reviewDo, r => r.Id.IsIn(reviewIds))
        .Inner.JoinQueryOver(g => g.GroupTests, () => groupTestDo, gt => gt.IsPublished)
        .OrderBy(gt => gt.Title).Asc
        .SelectList(list =>
            list.Select(() => groupTestDo.Id).WithAlias(() => groupTestDo.Id)
            .Select(() => groupTestDo.Title).WithAlias(() => groupTestDo.Title))
    .TransformUsing(Transformers.AliasToBean<GroupTestDo>())
    .List<GroupTestDo>();
```

### 4. Eager fetching down two levels

In this example, we are attempting to retrieve all the ListingCategories and the Categories for each of those ListingCategories. Doing this all in the same query using the Fetch Eager.

``` c#
if (fetchListingCategories) {
query = query.Fetch(c => c.ListingCategories).Eager
        .Fetch(c => c.ListingCategories[0].Categories).Eager;
}
```

The two fetch commands, translate to the following in SQL:

``` sql
left outer join ListingCategory listingcat4_
    on this_.ListingId = listingcat4_.ListingId
left outer join Category categorydo5_
    on listingcat4_.CategoryId = categorydo5_.CategoryId
```

You can learn more about nHibernate fetching strategies [here](http://nhibernate.info/doc/nhibernate-reference/performance.html). 

### 6. Subqueries

Subqueries are very useful for retrieving data in some cases.

``` c#
//This is a nHibernate LINQ lambda expression only
var groupTestReviewsIdsDetachedQuery = QueryOver.Of<GroupTestReviewDo>()
        .Where(gtr => gtr.GroupTestId == groupTestId)
        .Select(Projections.Distinct(Projections.Property<GroupTestReviewDo>(p => p.ReviewId)));

//The expression defined above will be used in the below database query.
var reviews =
        NHibernateSession.QueryOver<ReviewDo>()
        .WithSubquery.WhereProperty(r => r.Id).In(groupTestReviewsIdsDetachedQuery)
        .Where(r => r.IsPublished)
        .Fetch(r => r.ProductDo).Eager
        .OrderBy(r => r.Title).Asc
        .ReadOnly().List();

```

You can read more on NHibernate subqueries [here](http://www.andrewwhitaker.com/blog/2014/10/24/queryover-series-part-8-working-with-subqueries/).

### 7. Refactoring legacy loop code to use NHibernate Future Query / multiple result sets

In this example, imagine we encounter some pre-existing legacy code that executes a database select statement within a for loop. This results in unnecessary round trips to the database, e.g., connecting, executing query, returning results, NHibernate automatically transforming results to C# classes etc.

Database queries in loops are generally discouraged.

``` c#
private IEnumerable<ListingCategoryDo> GetMostRecentListingCategoriesByListing(List<Listing> listingResults)
{
    for (int i = 0; i < listingResults.Count; i++)
    {
        var listing = listingResults[i];
        ListingCategoryDo topListingCategoryForListing =
                    NHibernateSession.CreateQuery("FROM ListingCategoryDo l WHERE l.ListingId = :listingId ORDER BY l.PublishDate DESC")
                        .SetParameter("listingId", listingId)
                        .SetReadOnly(true)
                        .SetMaxResults(1)
                        .UniqueResult<ListingCategoryDo>();

        yield return topListingCategoryForListing;
    }
}

//this will hit the database (n times)
//n round-trips will be made (n = listingResults.Count)
List<ListingCategoryDo> mostRecentListingCategoriesForListings = GetMostRecentListingCategoriesByListing(listingResults).ToList();
```

Fortunately, we can refactor the above query code quite easily, to perform a batch SELECT command, that will return multiple result sets.

In the below example: the for loop is only generating the batch SQL behind the scenes. The database round-trip happens once, on demand after the entire loop is complete. Improving efficiency drastically.

``` c#
private IEnumerable<IFutureValue<ListingCategoryDo>> GetMostRecentListingCategoriesByListing(List<Listing> listingResults)
{
    for (int i = 0; i < listingResults.Count; i++)
    {
        var listing = listingResults[i];
        IFutureValue<ListingCategoryDo> topListingCategoryForListing =
                NHibernateSession.CreateQuery("FROM ListingCategoryDo l WHERE l.ListingId = :listingId ORDER BY l.PublishDate DESC")
                    .SetParameter("listingId", listingId)
                    .SetReadOnly(true)
                    .SetMaxResults(1)
                    .UniqueResult<ListingCategoryDo>();

        yield return topListingCategoryForListing;
    }
}

//this will set up all the SQL select statements
var mostRecentListingCategoriesForListingsFuture = GetMostRecentListingCategoriesByListing(listingResults).ToList(); 

//this will perform the database query with multiple result sets
var mostRecentListingCategoriesForListings = mostRecentListingCategoriesForListingsFuture.Select(fq => fq.Value).ToList();
```

You can read more about future queries [here](https://ayende.com/blog/3979/nhibernate-futures)

I think that we can all benefit from using type-safe queries with NHibernate, let me know in the comments if you have any questions on how to implement something using QueryOver and NHibernate.