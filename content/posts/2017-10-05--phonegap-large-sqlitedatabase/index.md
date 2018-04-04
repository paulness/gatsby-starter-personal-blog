---
title: Creating an Android app, with a large offline database (over 4GB)
subTitle: Today we will be covering large SQLite databases with the Android PhoneGap framework. We will be going over the challenges and opportunities of running offline Android apps with scale.
cover: npi-search-logo.png
category: mobile
---

A few years ago I was tasked with creating an Android application, which held and searched on all of the medical information available in the monthly 5GB [NPI Data Dissemination CSV](http://download.cms.gov/nppes/NPI_Files.html), all offline.

[See technical presentation for the app (PPT)](npi-search-presentation.pptx)

This was quite a challenging app to build for the following reasons:

* [Complicated business requirements for search](npi-search-app-learn-how-to-understand-the-search-results.pdf)
* Underpowered tablets, storage, CPU, and RAM
* The database exceeded the maximum size permitted for bundling on Google Play
The file system on the tablet could not support single files over 2GB. Therefore the database was split across three files.

This blog post hopes to help others in overcoming any challenges in building an app with such a large database.

## Underpowered tablets and pre-processing step

The devices had insufficient processing power to perform any query other than an exact match search on an indexed column. Indeed not powerful enough to execute SQLite LIKE searches on across this database. Only exact queries on indexed columns would return results in an acceptable time-frame.

Since the [business requirements](npi-search-app-learn-how-to-understand-the-search-results.pdf) for name searching required LIKE search in addition to many other types of search. It was imperative to pre-arrange all data that the app needed, such that an exact match would return all results desired by the business. For example, JOHN SMITH would return JOHNNIE SMITH, JON SMITH, etc.

### Multi-threaded C# SQLite database builder

To solve this problem, I created a multi-threaded program in C# that transformed the [NPI Data Dissemination CSV](http://download.cms.gov/nppes/NPI_Files.html) and produced a SQLite database.

1. Associated all names that would match 'if SQL Like was possible.'
1. Associated all names that matched due to name variation
1. Associated all names that matched when broken down into pieces
1. Produced a searchable SQLite NPI database, such that the tablet did not have to do any of the 'work.'

I knew that a modern computer would have sufficient power to process even the most complicated associations on this CSV file. By pushing the workload onto the computer, I was alleviating the workload on the devices. This program ran on a computer with 32 cores and 32GB of RAM, only once per month.

Sample unit test code for showing some of name matching rules

``` c#
using System.Collections.Generic;
using System.Linq;
using DBBuilder.Business.Services.Stage1SingleName;
using DBBuilder.Business.Services.Stage2CompleteName;
using DBBuilder.Data;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace DBBuilder.Business.Test
{
    [TestClass]
    public class TestNameMatchLogic
    {
        [TestMethod]
        public void TestMatchToEmptyName()
        {
            List<NameAndLinkedNames> firstNames = new List<NameAndLinkedNames>()
            {
                new NameAndLinkedNames(){Name = "KY", ExactMatches = new List<int> { 64334 }},
                new NameAndLinkedNames(){Name = "", ExactMatches = new List<int> { 100001 }}
            };

            firstNames = NameAssociatorService.FindLinkedNames(firstNames, new Dictionary<string, HashSet<string>>());
        }

        [TestMethod]
        public void TestShortNameBrokenNameMatchLogic()
        {
            //FULL NAME 1 - LUCY LU CHANG (64334)
            //FULL NAME 2 - LU CHANGER (100001)
            var fullUnprocessedNames = new NpiUnprocessedNamePair[] {
                new NpiUnprocessedNamePair() { FirstName = "LUCY L", LastName = "CHANG" },
                new NpiUnprocessedNamePair() { FirstName = "L", LastName = "CHANGER" },
            };


            List<NameAndLinkedNames> firstNames = new List<NameAndLinkedNames>()
            {
                new NameAndLinkedNames(){Name = "LUCY L", ExactMatches = new List<int> { 64334 }},
                new NameAndLinkedNames(){Name = "L", ExactMatches = new List<int> { 100001 }}
            };

            List<NameAndLinkedNames> lastNames = new List<NameAndLinkedNames>()
            {
                new NameAndLinkedNames(){Name = "CHANG", ExactMatches = new List<int> { 64334 }},
                new NameAndLinkedNames(){Name = "CHANGER", ExactMatches = new List<int> { 100001 }}
            };

            Dictionary<string, HashSet<string>> nameVariationsDictionary = new Dictionary<string, HashSet<string>>();
            firstNames = NameAssociatorService.FindLinkedNames(firstNames, nameVariationsDictionary);
            lastNames = NameAssociatorService.FindLinkedNames(lastNames, nameVariationsDictionary);

            var results = NameJoinerService.PerformFinalTranslationOnProcessedResults(fullUnprocessedNames, firstNames, lastNames);

            Assert.AreEqual(results.Find(n => n.FirstName == "L" && n.LastName == "CHANGER").AdditionalMatchesByBrokenUpNameMatch[0], 64334);
            Assert.AreEqual(results.Find(n => n.FirstName == "LUCY L" && n.LastName == "CHANG").AdditionalMatches[0], 100001);
        }

        /// <summary>
        /// This tests the core name matching logic from start to finish. 
        /// If this test starts failing you have broken something major!
        /// </summary>
        [TestMethod]
        public void TestBrokenNameMatchLogic()
        {
            Dictionary<string, HashSet<string>> nameVariationsDictionary = new Dictionary<string, HashSet<string>>()
            {
                { "HELEN", new HashSet<string> {"ELLEN", "NELLY" } },
                { "VAN", new HashSet<string> {"JON" } },
                { "HELEN-MARIA VAN-DAM", new HashSet<string> { "VUNDERBELT" } }
            };

            List<NameAndLinkedNames> firstNames = new List<NameAndLinkedNames>()
            {
                new NameAndLinkedNames(){Name = "VUNDERBELT", ExactMatches = new List<int> { 64334, 100001 }}, //variation of full name
                new NameAndLinkedNames(){Name = "VUNDERBELT2", ExactMatches =  new List<int> {70}}, //nothing
                new NameAndLinkedNames(){Name = "HELEN VAN DAM",  ExactMatches = new List<int> {98989898}}, //partial piece
                new NameAndLinkedNames(){Name = "HELEN VAN",  ExactMatches = new List<int> {8888}}, //partial piece
                new NameAndLinkedNames(){Name = "MARIA VAN",  ExactMatches = new List<int> {555}}, //partial piece
                new NameAndLinkedNames(){Name = "VAN DAM",  ExactMatches = new List<int> {1111}}, //partial piece
                new NameAndLinkedNames(){Name = "HELEN", ExactMatches =  new List<int> {49999999}}, //partial piece of name 
                new NameAndLinkedNames(){Name = "JON",  ExactMatches = new List<int> {49999997}}, //partial piece that is also a variation
                new NameAndLinkedNames(){Name = "ELLEN",  ExactMatches = new List<int> {666666}} //partial piece that is also a variation
            };

            firstNames = NameAssociatorService.FindLinkedNames(firstNames, nameVariationsDictionary);


            //check VUNDERBELT
            var vunderbeltMatches = firstNames.First(n => n.Name == "VUNDERBELT");

            //VUNDERBELT LongerNameLikeMatches
            Assert.AreEqual(vunderbeltMatches.LongerNameLikeMatches.Count, 1);
            Assert.IsTrue(vunderbeltMatches.LongerNameLikeMatches[0].Name == "VUNDERBELT2");
            Assert.AreEqual(vunderbeltMatches.LongerNameLikeMatches[0], firstNames.First(n => n.Name == "VUNDERBELT2"));

            //VUNDERBELT LongerNameLikeMatches all other matches are empty
            Assert.IsFalse(vunderbeltMatches.ShorterNameLikeMatches.Any());
            Assert.IsNull(vunderbeltMatches.NameVariationMatches);
            Assert.IsNull(vunderbeltMatches.PartialNameMatches);
            Assert.IsNull(vunderbeltMatches.PartialNameVariationMatches);



            //check HELEN
            var helensMatches = firstNames.First(n => n.Name == "HELEN VAN DAM");

            //HELEN LongerNameLikeMatches empty
            Assert.IsTrue(helensMatches.LongerNameLikeMatches == null || !helensMatches.LongerNameLikeMatches.Any());

            //HELEN ShorterNameLikeMatches
            Assert.AreEqual(helensMatches.ShorterNameLikeMatches.Count, 3);
            Assert.IsTrue(helensMatches.ShorterNameLikeMatches.Any(m => m.Name == "HELEN VAN"));
            Assert.IsTrue(helensMatches.ShorterNameLikeMatches.Any(m => m.Name == "VAN DAM"));
            Assert.IsTrue(helensMatches.ShorterNameLikeMatches.Any(m => m.Name == "HELEN"));

            //HELEN partial name matches
            Assert.IsTrue(helensMatches.PartialNameMatches.Any(m => m.Name == "VAN DAM"));

            var names = new NpiUnprocessedNamePair[] { new NpiUnprocessedNamePair() { FirstName = "HELEN VAN DAM", LastName = "SMITH" } };


            List<NameAndLinkedNames> lastNames = new List<NameAndLinkedNames>()
            {
                 new NameAndLinkedNames()
                 {
                     Name = "SMITH", 
                     ExactMatches = new List<int> {98989898}
                 },
                 new NameAndLinkedNames()
                 {
                     Name = "SMITHY", 
                     ExactMatches = new List<int> {49999997}
                 },
                 new NameAndLinkedNames()
                 {
                     Name = "SMIT", 
                     ExactMatches = new List<int> {555}
                 },
                 new NameAndLinkedNames()
                 {
                     Name = "SM", 
                     ExactMatches = new List<int> {1111}
                 },
            };

            lastNames = NameAssociatorService.FindLinkedNames(lastNames, nameVariationsDictionary);

            var results = NameJoinerService.PerformFinalTranslationOnProcessedResults(names, firstNames, lastNames);

            //verify counts
            Assert.AreEqual(results.Count, 1);
            Assert.AreEqual(results[0].AdditionalMatches.Count, 1);
            Assert.AreEqual(results[0].AdditionalMatchesByBrokenUpNameMatch.Count, 1);
            Assert.AreEqual(results[0].AssociatedNpiEntriesByPartialNameVariation.Count, 1);
            Assert.AreEqual(results[0].ExactMatches.Count, 1);

            //verify name
            Assert.AreEqual(results[0].FirstName, "HELEN VAN DAM");
            Assert.AreEqual(results[0].LastName, "SMITH");

            //verify date
            Assert.IsTrue(results[0].AdditionalMatches[0] == 1111);
            Assert.IsTrue(results[0].AdditionalMatchesByBrokenUpNameMatch[0] == 555);
            Assert.IsTrue(results[0].AssociatedNpiEntriesByPartialNameVariation[0] == 49999997);
            Assert.IsTrue(results[0].ExactMatches[0] == 98989898);



        }

    }
}
```

``` c#
using System.Collections.Generic;
using System.IO;
using DBBuilder.Data;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace DBBuilder.Business.Test
{
    [TestClass]
    public class TestIntersectionOfFirstNameAndLastNameLookups
    {
        [TestMethod]
        public void TestIntersectionWithVariedData()
        {
            ProcessNpiMonthlyFile.LeaveStreamsOpen = true;

            using (MemoryStream ms = new MemoryStream())
            {
                List<NpiUnprocessedNamePair> npiUnprocessedNames = new List<NpiUnprocessedNamePair>
                {
                    new NpiUnprocessedNamePair()
                    {
                        FirstName = "JOHN-TODD",
                        LastName = "SMITH-JOHNNIE"
                    },
                    new NpiUnprocessedNamePair()
                    {
                        FirstName = "JOHN-TODD",
                        LastName = "HOWARD"
                    }
                };


                NpiProcessedNames firstNameProcessedNames = new NpiProcessedNames()
                {
                    NameDataStore = new List<NpiProcessedName>()
                    {
                        new NpiProcessedName()
                        {
                            Name = "JOHN-TODD",
                            ExactMatches = new List<int> { 1, 99 }, //JOHN-TODD
                            AdditionalMatches = new List<int> { 2 }, //JOHN-TODDLER
                            AdditionalMatchesByBrokenUpNameMatch = new List<int> {3, 4, 9}, //TODD and TIM
                            AssociatedNpiEntriesByPartialNameVariation = new List<int> { 5 } //JOHNNIE
                        }
                    },
                    LookupIndexesForNameDataStore = new Dictionary<string, int>()
                    {
                        { "JOHN-TODD", 0 }
                    }

                };
                NpiProcessedNames lastNameProcessedNames = new NpiProcessedNames() 
                {
                    NameDataStore = new List<NpiProcessedName>()
                    {
                        new NpiProcessedName()
                        {
                            Name = "SMITH-JOHNNIE",
                            ExactMatches = new List<int> { 1, 9, 99 }, //SMITH-JOHNNIE
                            AdditionalMatches = new List<int> { 2, 3, 99 }, //SMITHY and TODD
                            AdditionalMatchesByBrokenUpNameMatch = new List<int> { 5, 99, 9 },
                            AssociatedNpiEntriesByPartialNameVariation = new List<int> { 99 }
                        },
                        new NpiProcessedName()
                        {
                            Name = "HOWARD",
                            ExactMatches = new List<int> { 99 }, //HOWARD
                            AdditionalMatches = new List<int> { 777, 888, 2 }, //HOWARDEN and HOWIE
                            AdditionalMatchesByBrokenUpNameMatch = new List<int> {  },
                            AssociatedNpiEntriesByPartialNameVariation = new List<int> {  }
                        }
                    },
                    LookupIndexesForNameDataStore = new Dictionary<string, int>()
                    {
                        { "SMITH-JOHNNIE", 0 },
                        { "HOWARD", 1 }
                    }
                };


                var results = ProcessNpiMonthlyFile.ProduceAndSaveCompletedNpiSearchLookup(ms, npiUnprocessedNames, firstNameProcessedNames, lastNameProcessedNames);

                using (var sr = new StreamReader(ms))
                {
                    ms.Position = 0;
                    var csvRow = sr.ReadLine();

                    //1 and 99 are exact matches in both (99 is a name broken up match in lastnames but exact matches trump last names)
                    //2 is an additional match in both
                    //3 is a name broken up match in firstnames and 3 is a additional match in lastnames (broken up matches trumps additional matches)
                    //9 is a name broken up match in both and also an exact match in last names (therefore it is a name broken up match)
                    //5 is a name broken up variation match in firstnames and is a standard name broken up match in lastnames

                    //4 only exists in firstnames which is why it doesn't exist in the output

                    Assert.AreEqual(@"JOHN-TODD,SMITH-JOHNNIE,""1,99"",2,""3,9"",5", csvRow);


                    csvRow = sr.ReadLine();

                    Assert.AreEqual(@"JOHN-TODD,HOWARD,99,2,,", csvRow);
                };
            }
        }
    }
}
```

Sample code from the NameAssociatorService.cs

``` c#
using System;
using System.Collections.Generic;
using System.Linq;
using DBBuilder.Core.Extensions;
using DBBuilder.Data;
using NPIAPI.Data;

namespace DBBuilder.Business.Services.Stage1SingleName
{
    public class NameAssociatorService
    {
        public static List<NpiSplitNameUnprocessed> FindLinkedNamesViaPartialPieceMatch(List<NpiSplitNameUnprocessed> unprocessedSplitNames, List<NameAndLinkedNames> peopleWithFullNamesEqualToAPartialPiece)
        {
            //process partial to partial
            List<NpiSplitNameUnprocessed> allUnprocessedSplitNames = unprocessedSplitNames;
            unprocessedSplitNames = unprocessedSplitNames.AsParallel().Select(thisPerson =>
                {
                    thisPerson.MatchedPeopleByPartialToPartialNameMatch = allUnprocessedSplitNames.Where(otherPerson =>
                        {
                            bool isOtherPersonRelated = otherPerson.ThisPerson != thisPerson.ThisPerson && thisPerson.NamePieces.Intersect(otherPerson.NamePieces).Any();
                            return isOtherPersonRelated;
                        }).Select(o => o.ThisPerson).ToList();

                    return thisPerson;
                }).ToList();

            //process partial to full name
            unprocessedSplitNames = unprocessedSplitNames.AsParallel().Select(thisPerson =>
                {
                    thisPerson.MatchedPeopleByPartialToFullNameMatch = peopleWithFullNamesEqualToAPartialPiece.Where(otherPerson =>
                        thisPerson.NamePieces.Contains(otherPerson.Name)).ToList();

                    return thisPerson;
                }).ToList();


            return unprocessedSplitNames;
        }

        public static List<NpiSplitNameUnprocessed> FindLinkedNamesViaPartialVariationPieceMatch(List<NpiSplitNameUnprocessed> unprocessedSplitNames, List<NameAndLinkedNames> peopleWithFullNamesEqualToAVariationOfAPartialPiece, Dictionary<string, HashSet<string>> nameVariationLookup)
        {
            List<NpiSplitNameUnprocessed> unprocessedSplitNamesWithVariations = unprocessedSplitNames.Where(up => up.NamePieceVariations.Any()).ToList();
            List<NpiSplitNameUnprocessed> unprocessedSplitNamesWithNoVariations = unprocessedSplitNames.Except(unprocessedSplitNamesWithVariations).ToList();
            List<NpiSplitNameUnprocessed> allUnprocessedSplitNames = unprocessedSplitNames;

            //process partial variation to partial
            unprocessedSplitNamesWithVariations = unprocessedSplitNamesWithVariations.AsParallel().Select(thisPerson =>
            {
                thisPerson.MatchedPeopleByPartialVariationToPartialNameMatch = allUnprocessedSplitNames.Where(otherPerson =>
                    {
                        bool isOtherPersonRelated = otherPerson.ThisPerson != thisPerson.ThisPerson && thisPerson.NamePieceVariations.Any(nv => otherPerson.NamePieces.Any(onp => nameVariationLookup[nv].Contains(onp)));
                        return isOtherPersonRelated;
                    }).Select(o => o.ThisPerson).ToList();

                return thisPerson;
            }).ToList();

            //process partial variation to full name
            unprocessedSplitNamesWithVariations = unprocessedSplitNamesWithVariations.AsParallel().Select(thisPerson =>
            {
                thisPerson.MatchedPeopleByPartialVariationToFullNameMatch = peopleWithFullNamesEqualToAVariationOfAPartialPiece.Where(otherPerson =>
                    thisPerson.NamePieceVariations.Any(nv => nameVariationLookup[nv].Contains(otherPerson.Name))).ToList();

                return thisPerson;
            }).ToList();

            return unprocessedSplitNamesWithVariations.Concat(unprocessedSplitNamesWithNoVariations).ToList();
        }

        public static List<NameAndLinkedNames> FindLinkedNames(List<NameAndLinkedNames> uniqueNamesAndExactMatches, Dictionary<string, HashSet<string>> nameVariationLookup)
        {
            List<NameAndLinkedNames> results;

            Console.WriteLine(@"uniqueNamesAndExactMatches count: {0}", uniqueNamesAndExactMatches.Count);

            //process normal names using standard smart like match
            {
                NamesGroupedByNameCharLength[] uniqueFirstnamesAndExactMatchesGroupedByNameLength = uniqueNamesAndExactMatches.AsParallel()
                    .GroupBy(n => n.Name.Length)
                    .Select(n => new NamesGroupedByNameCharLength() { NameCharLength = n.Key, AllNamesAtThisCharLength = n.Select(k => k).ToList() })
                    .OrderBy(n => n.NameCharLength)
                    .ToArray();

                results = NameAssociatorService.FindLinkedNamesWithSmartLikeMatch(uniqueFirstnamesAndExactMatchesGroupedByNameLength);

                Console.WriteLine(@"namesAssociatedWithSmartLikeMatch count: {0}", results.Count);
            }


            //process broken piece names using standard smart like match
            {
                List<NameAndLinkedNames> peopleWithNamesThatCanBeBrokenUp = results.AsParallel().Where(s => s.Name.NameCanBeSplitOrIsInitial()).ToList();
                Console.WriteLine(@"peopleWithNamesThatCanBeBrokenUp count: {0}", peopleWithNamesThatCanBeBrokenUp.Count);

                //remove from results
                results = results.Except(peopleWithNamesThatCanBeBrokenUp).ToList();

                //process broken piece names further and finally add the processed results 
                HashSet<string> allUniqueNamePieces =
                    new HashSet<string>(peopleWithNamesThatCanBeBrokenUp.AsParallel().SelectMany(s => s.Name.SplitNameIntoPieces()).Distinct());
                Console.WriteLine(@"allUniqueNamePieces count: {0}", allUniqueNamePieces.Count);

                HashSet<string> allUniqueNamePieceVariations = new HashSet<string>(allUniqueNamePieces.Where(nameVariationLookup.ContainsKey).SelectMany(namePiece => nameVariationLookup[namePiece]));
                Console.WriteLine(@"allUniqueNamePieceVariations count: {0}", allUniqueNamePieceVariations.Count);

                List<NameAndLinkedNames> peopleWithFullNamesEqualToAPartialPiece = uniqueNamesAndExactMatches.Except(peopleWithNamesThatCanBeBrokenUp).AsParallel().Where(s => allUniqueNamePieces.Contains(s.Name)).ToList();
                Console.WriteLine(@"peopleWithFullNamesEqualToAPartialPiece count: {0}", peopleWithFullNamesEqualToAPartialPiece.Count);

                List<NameAndLinkedNames> peopleWithFullNamesEqualToAVariationOfAPartialPiece = uniqueNamesAndExactMatches.Except(peopleWithNamesThatCanBeBrokenUp).AsParallel().Where(s => allUniqueNamePieceVariations.Contains(s.Name)).ToList();
                Console.WriteLine(@"peopleWithFullNamesEqualToAVariationOfAPartialPiece count: {0}", peopleWithFullNamesEqualToAVariationOfAPartialPiece.Count);

                //ready data (all these people have already been filtered from peopleWithNamesThatCanBeBrokenUp)
                List<NpiSplitNameUnprocessed> readiedDataForSplitNameMatches = peopleWithNamesThatCanBeBrokenUp.AsParallel().Select(thisPerson =>
                {
                    var thisPersonsNamePieces = thisPerson.Name.SplitNameIntoPieces().ToList();
                    var thisPersonsNamePieceVariations = thisPersonsNamePieces.Where(nameVariationLookup.ContainsKey).ToList();
                    return new NpiSplitNameUnprocessed { ThisPerson = thisPerson, NamePieces = thisPersonsNamePieces, NamePieceVariations = thisPersonsNamePieceVariations };
                }).ToList();

                //process non-variation
                readiedDataForSplitNameMatches = FindLinkedNamesViaPartialPieceMatch(readiedDataForSplitNameMatches, peopleWithFullNamesEqualToAPartialPiece);

                //process variation
                readiedDataForSplitNameMatches = FindLinkedNamesViaPartialVariationPieceMatch(readiedDataForSplitNameMatches, peopleWithFullNamesEqualToAVariationOfAPartialPiece, nameVariationLookup);

                //add to main list
                results.AddRange(readiedDataForSplitNameMatches.Select(Mappers.MapFrom));
            }

            //process all names using standard variation match
            {
                //get from results
                NameAndLinkedNames[] peopleWithNameVariations = results.Where(s => nameVariationLookup.ContainsKey(s.Name)).ToArray();

                Console.WriteLine(@"peopleWithNameVariations count: {0}", peopleWithNameVariations.Length);

                //remove from results
                results = results.Except(peopleWithNameVariations).ToList();

                //process
                NameAndLinkedNames[] processedPeopleWithNameVariations = peopleWithNameVariations.AsParallel().Select(thisPerson =>
                {
                    HashSet<string> variations = nameVariationLookup[thisPerson.Name];

                    List<NameAndLinkedNames> relatedPeopleByNameVariation = peopleWithNameVariations.Where(otherPerson => variations.Contains(otherPerson.Name)).ToList();

                    thisPerson.NameVariationMatches = relatedPeopleByNameVariation;

                    return thisPerson;

                }).ToArray();

                //add back to results
                results.AddRange(processedPeopleWithNameVariations);

                Console.WriteLine(@"processedPeopleWithNameVariations count: {0}", results.Count);
            }

            return results;
        }

        private static List<NameAndLinkedNames> FindLinkedNamesWithSmartLikeMatch(NamesGroupedByNameCharLength[] namesOrderedByNameLengthAsc)
        {
            if (namesOrderedByNameLengthAsc == null || namesOrderedByNameLengthAsc.Length < 1)
            {
                return new List<NameAndLinkedNames>();
            }

            int lastIndex = namesOrderedByNameLengthAsc.Length - 1;
            Console.WriteLine(@"Shortest name length: {0}", namesOrderedByNameLengthAsc[0].NameCharLength);
            Console.WriteLine(@"Longest name length: {0}", namesOrderedByNameLengthAsc[lastIndex].NameCharLength);

            for (int i = 0; i < namesOrderedByNameLengthAsc.Length; i++)
            {
                int nameLength = namesOrderedByNameLengthAsc[i].NameCharLength;

                if (nameLength < 2)
                {
                    continue;
                }

                Console.WriteLine(@"Starting processing of all names with name char length of : {0}", nameLength);

                List<NameAndLinkedNames> allNamesAtThisCharLength = namesOrderedByNameLengthAsc[i].AllNamesAtThisCharLength;

                int indexOfNext = i + 1;
                int countOfRemainingElementsAfterNext = namesOrderedByNameLengthAsc.Length - (indexOfNext);

                ArraySegment<NamesGroupedByNameCharLength>? allShorterNames = null, allLongerNames = null;
                bool processShortNames = false, processLongerNames = false;

                if (i > 0)
                {
                    allShorterNames = new ArraySegment<NamesGroupedByNameCharLength>(namesOrderedByNameLengthAsc, 0, i);
                    processShortNames = true;
                }

                if (i < lastIndex)
                {
                    allLongerNames = new ArraySegment<NamesGroupedByNameCharLength>(namesOrderedByNameLengthAsc, indexOfNext, countOfRemainingElementsAfterNext);
                    processLongerNames = true;
                }


                if (processShortNames && processLongerNames)
                {
                    namesOrderedByNameLengthAsc[i].AllNamesAtThisCharLength = allNamesAtThisCharLength.AsParallel().Select(thisPerson =>
                    {
                        string thisPersonsName = thisPerson.Name;
                        thisPerson.ShorterNameLikeMatches = allShorterNames.Value.SelectMany(s => s.AllNamesAtThisCharLength)
                                .Where(personWithShorterName => thisPersonsName.StringContainsFast(personWithShorterName.Name)).ToList();

                        thisPerson.LongerNameLikeMatches = allLongerNames.Value.SelectMany(s => s.AllNamesAtThisCharLength)
                                .Where(personWithLongerName => personWithLongerName.Name.StringContainsFast(thisPersonsName)).ToList();

                        return thisPerson;
                    }).ToList();
                }
                else if (processShortNames)
                {
                    namesOrderedByNameLengthAsc[i].AllNamesAtThisCharLength = allNamesAtThisCharLength.AsParallel().Select(thisPerson =>
                    {
                        string thisPersonsName = thisPerson.Name;
                        thisPerson.ShorterNameLikeMatches = allShorterNames.Value.SelectMany(s => s.AllNamesAtThisCharLength)
                                .Where(personWithShorterName => thisPersonsName.StringContainsFast(personWithShorterName.Name)).ToList();

                        return thisPerson;
                    }).ToList();
                }
                else if (processLongerNames)
                {
                    namesOrderedByNameLengthAsc[i].AllNamesAtThisCharLength = allNamesAtThisCharLength.AsParallel().Select(thisPerson =>
                    {
                        string thisPersonsName = thisPerson.Name;
                        thisPerson.LongerNameLikeMatches = allLongerNames.Value.SelectMany(s => s.AllNamesAtThisCharLength)
                                .Where(personWithLongerName => personWithLongerName.Name.StringContainsFast(thisPersonsName)).ToList();

                        return thisPerson;

                    }).ToList();
                }
            }

            List<NameAndLinkedNames> results = namesOrderedByNameLengthAsc.AsParallel().SelectMany(n => n.AllNamesAtThisCharLength).ToList();

            return results;
        }
    }
}
```

## Attaching multiple databases

On the device itself, there was a filesystem limitation of 2GB per file. I had to attach multiple SQLite databases to avoid the 2GB file size limitation. See PhoneGap plugin JavaScript code below:

``` javascript
self.db = window.sqlitePlugin.openDatabase("npi-lookup-database-v2.db", "1.0", "lookup", -1);
self.db.executeSql("ATTACH DATABASE '/sdcard/npi-datastore-database1.db' as 'datastore1';", [], undefined, self.forceUserToRedownloadDatabases);
self.db.executeSql("ATTACH DATABASE '/sdcard/npi-datastore-database2.db' as 'datastore2';", [], undefined, self.forceUserToRedownloadDatabases);
self.db.executeSql("ATTACH DATABASE '/sdcard/npi-datastore-database3.db' as 'datastore3';", [], undefined, self.forceUserToRedownloadDatabases);
```

Querying those three databases, using UNION ALL

``` javascript
Database.prototype.queryDatabaseByNpiNumber = function (npinumber) {
    var self = this;
    var commonSqlSelectStatement = '' +
        ' SELECT rowid, NPI, ProviderFirstName, ProviderMiddleName, ProviderLastNameLegalName, ProviderFirstLineBusinessMailingAddress, ProviderSecondLineBusinessMailingAddress,' +
        ' ProviderBusinessMailingAddressCityName, ProviderBusinessMailingAddressStateName, ProviderBusinessMailingAddressPostalCode, ProviderBusinessMailingAddressCountryCodeIfoutsideUS ';

    var fromDataStore1 = '' +
        ' FROM datastore1.NPI WHERE NPI = ?1 UNION ALL ';

    var fromDataStore2 = '' +
        ' FROM datastore2.NPI WHERE NPI = ?1 UNION ALL ';

    var fromDataStore3 = '' +
        ' FROM datastore3.NPI WHERE NPI = ?1 LIMIT 1;';

    var sqlStatement = commonSqlSelectStatement + fromDataStore1 + commonSqlSelectStatement + fromDataStore2 + commonSqlSelectStatement + fromDataStore3;

    return sqlStatement;
}
```

## In summary

It is possible to have a fast/usable large database on an underpowered mobile device. However, you must arrange the data in a way that the device can retrieve what it needs with minimal effort. The tablet requires a bespoke database explicitly designed with its usage in mind.