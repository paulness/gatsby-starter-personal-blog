webpackJsonp([0xbffcf058d326],{798:function(e,n){e.exports={data:{post:{id:"/root/project/content/posts/2017-10-05--phonegap-large-sqlitedatabase/index.md absPath of file >>> MarkdownRemark",html:'<p>A few years ago I was tasked with creating an Android application, which held and searched on all of the medical information available in the monthly 5GB <a href="http://download.cms.gov/nppes/NPI_Files.html">NPI Data Dissemination CSV</a>, all offline.</p>\n<p><a href="/npi-search-presentation-98fe442f903f262c49d17a60ba9ca25e.pptx">See technical presentation for the app (PPT)</a></p>\n<p>This was quite a challenging app to build for the following reasons:</p>\n<ul>\n<li><a href="/npi-search-app-learn-how-to-understand-the-search-results-89647de30bf0e36315f73963eab79e1a.pdf">Complicated business requirements for search</a></li>\n<li>Underpowered tablets, storage, CPU, and RAM</li>\n<li>The database exceeded the maximum size permitted for bundling on Google Play\nThe file system on the tablet could not support single files over 2GB. Therefore the database was split across three files.</li>\n</ul>\n<p>This blog post hopes to help others in overcoming any challenges in building an app with such a large database.</p>\n<h2>Underpowered tablets and pre-processing step</h2>\n<p>The devices had insufficient processing power to perform any query other than an exact match search on an indexed column. Indeed not powerful enough to execute SQLite LIKE searches on across this database. Only exact queries on indexed columns would return results in an acceptable time-frame.</p>\n<p>Since the <a href="/npi-search-app-learn-how-to-understand-the-search-results-89647de30bf0e36315f73963eab79e1a.pdf">business requirements</a> for name searching required LIKE search in addition to many other types of search. It was imperative to pre-arrange all data that the app needed, such that an exact match would return all results desired by the business. For example, JOHN SMITH would return JOHNNIE SMITH, JON SMITH, etc.</p>\n<h3>Multi-threaded C# SQLite database builder</h3>\n<p>To solve this problem, I created a multi-threaded program in C# that transformed the <a href="http://download.cms.gov/nppes/NPI_Files.html">NPI Data Dissemination CSV</a> and produced a SQLite database.</p>\n<ol>\n<li>Associated all names that would match ‘if SQL Like was possible.’</li>\n<li>Associated all names that matched due to name variation</li>\n<li>Associated all names that matched when broken down into pieces</li>\n<li>Produced a searchable SQLite NPI database, such that the tablet did not have to do any of the ‘work.’</li>\n</ol>\n<p>I knew that a modern computer would have sufficient power to process even the most complicated associations on this CSV file. By pushing the workload onto the computer, I was alleviating the workload on the devices. This program ran on a computer with 32 cores and 32GB of RAM, only once per month.</p>\n<p>Sample unit test code for showing some of name matching rules</p>\n<div class="gatsby-highlight">\n      <pre class="language-c#"><code class="language-c#">using System.Collections.Generic;\nusing System.Linq;\nusing DBBuilder.Business.Services.Stage1SingleName;\nusing DBBuilder.Business.Services.Stage2CompleteName;\nusing DBBuilder.Data;\nusing Microsoft.VisualStudio.TestTools.UnitTesting;\n\nnamespace DBBuilder.Business.Test\n{\n    [TestClass]\n    public class TestNameMatchLogic\n    {\n        [TestMethod]\n        public void TestMatchToEmptyName()\n        {\n            List&lt;NameAndLinkedNames&gt; firstNames = new List&lt;NameAndLinkedNames&gt;()\n            {\n                new NameAndLinkedNames(){Name = &quot;KY&quot;, ExactMatches = new List&lt;int&gt; { 64334 }},\n                new NameAndLinkedNames(){Name = &quot;&quot;, ExactMatches = new List&lt;int&gt; { 100001 }}\n            };\n\n            firstNames = NameAssociatorService.FindLinkedNames(firstNames, new Dictionary&lt;string, HashSet&lt;string&gt;&gt;());\n        }\n\n        [TestMethod]\n        public void TestShortNameBrokenNameMatchLogic()\n        {\n            //FULL NAME 1 - LUCY LU CHANG (64334)\n            //FULL NAME 2 - LU CHANGER (100001)\n            var fullUnprocessedNames = new NpiUnprocessedNamePair[] {\n                new NpiUnprocessedNamePair() { FirstName = &quot;LUCY L&quot;, LastName = &quot;CHANG&quot; },\n                new NpiUnprocessedNamePair() { FirstName = &quot;L&quot;, LastName = &quot;CHANGER&quot; },\n            };\n\n\n            List&lt;NameAndLinkedNames&gt; firstNames = new List&lt;NameAndLinkedNames&gt;()\n            {\n                new NameAndLinkedNames(){Name = &quot;LUCY L&quot;, ExactMatches = new List&lt;int&gt; { 64334 }},\n                new NameAndLinkedNames(){Name = &quot;L&quot;, ExactMatches = new List&lt;int&gt; { 100001 }}\n            };\n\n            List&lt;NameAndLinkedNames&gt; lastNames = new List&lt;NameAndLinkedNames&gt;()\n            {\n                new NameAndLinkedNames(){Name = &quot;CHANG&quot;, ExactMatches = new List&lt;int&gt; { 64334 }},\n                new NameAndLinkedNames(){Name = &quot;CHANGER&quot;, ExactMatches = new List&lt;int&gt; { 100001 }}\n            };\n\n            Dictionary&lt;string, HashSet&lt;string&gt;&gt; nameVariationsDictionary = new Dictionary&lt;string, HashSet&lt;string&gt;&gt;();\n            firstNames = NameAssociatorService.FindLinkedNames(firstNames, nameVariationsDictionary);\n            lastNames = NameAssociatorService.FindLinkedNames(lastNames, nameVariationsDictionary);\n\n            var results = NameJoinerService.PerformFinalTranslationOnProcessedResults(fullUnprocessedNames, firstNames, lastNames);\n\n            Assert.AreEqual(results.Find(n =&gt; n.FirstName == &quot;L&quot; &amp;&amp; n.LastName == &quot;CHANGER&quot;).AdditionalMatchesByBrokenUpNameMatch[0], 64334);\n            Assert.AreEqual(results.Find(n =&gt; n.FirstName == &quot;LUCY L&quot; &amp;&amp; n.LastName == &quot;CHANG&quot;).AdditionalMatches[0], 100001);\n        }\n\n        /// &lt;summary&gt;\n        /// This tests the core name matching logic from start to finish. \n        /// If this test starts failing you have broken something major!\n        /// &lt;/summary&gt;\n        [TestMethod]\n        public void TestBrokenNameMatchLogic()\n        {\n            Dictionary&lt;string, HashSet&lt;string&gt;&gt; nameVariationsDictionary = new Dictionary&lt;string, HashSet&lt;string&gt;&gt;()\n            {\n                { &quot;HELEN&quot;, new HashSet&lt;string&gt; {&quot;ELLEN&quot;, &quot;NELLY&quot; } },\n                { &quot;VAN&quot;, new HashSet&lt;string&gt; {&quot;JON&quot; } },\n                { &quot;HELEN-MARIA VAN-DAM&quot;, new HashSet&lt;string&gt; { &quot;VUNDERBELT&quot; } }\n            };\n\n            List&lt;NameAndLinkedNames&gt; firstNames = new List&lt;NameAndLinkedNames&gt;()\n            {\n                new NameAndLinkedNames(){Name = &quot;VUNDERBELT&quot;, ExactMatches = new List&lt;int&gt; { 64334, 100001 }}, //variation of full name\n                new NameAndLinkedNames(){Name = &quot;VUNDERBELT2&quot;, ExactMatches =  new List&lt;int&gt; {70}}, //nothing\n                new NameAndLinkedNames(){Name = &quot;HELEN VAN DAM&quot;,  ExactMatches = new List&lt;int&gt; {98989898}}, //partial piece\n                new NameAndLinkedNames(){Name = &quot;HELEN VAN&quot;,  ExactMatches = new List&lt;int&gt; {8888}}, //partial piece\n                new NameAndLinkedNames(){Name = &quot;MARIA VAN&quot;,  ExactMatches = new List&lt;int&gt; {555}}, //partial piece\n                new NameAndLinkedNames(){Name = &quot;VAN DAM&quot;,  ExactMatches = new List&lt;int&gt; {1111}}, //partial piece\n                new NameAndLinkedNames(){Name = &quot;HELEN&quot;, ExactMatches =  new List&lt;int&gt; {49999999}}, //partial piece of name \n                new NameAndLinkedNames(){Name = &quot;JON&quot;,  ExactMatches = new List&lt;int&gt; {49999997}}, //partial piece that is also a variation\n                new NameAndLinkedNames(){Name = &quot;ELLEN&quot;,  ExactMatches = new List&lt;int&gt; {666666}} //partial piece that is also a variation\n            };\n\n            firstNames = NameAssociatorService.FindLinkedNames(firstNames, nameVariationsDictionary);\n\n\n            //check VUNDERBELT\n            var vunderbeltMatches = firstNames.First(n =&gt; n.Name == &quot;VUNDERBELT&quot;);\n\n            //VUNDERBELT LongerNameLikeMatches\n            Assert.AreEqual(vunderbeltMatches.LongerNameLikeMatches.Count, 1);\n            Assert.IsTrue(vunderbeltMatches.LongerNameLikeMatches[0].Name == &quot;VUNDERBELT2&quot;);\n            Assert.AreEqual(vunderbeltMatches.LongerNameLikeMatches[0], firstNames.First(n =&gt; n.Name == &quot;VUNDERBELT2&quot;));\n\n            //VUNDERBELT LongerNameLikeMatches all other matches are empty\n            Assert.IsFalse(vunderbeltMatches.ShorterNameLikeMatches.Any());\n            Assert.IsNull(vunderbeltMatches.NameVariationMatches);\n            Assert.IsNull(vunderbeltMatches.PartialNameMatches);\n            Assert.IsNull(vunderbeltMatches.PartialNameVariationMatches);\n\n\n\n            //check HELEN\n            var helensMatches = firstNames.First(n =&gt; n.Name == &quot;HELEN VAN DAM&quot;);\n\n            //HELEN LongerNameLikeMatches empty\n            Assert.IsTrue(helensMatches.LongerNameLikeMatches == null || !helensMatches.LongerNameLikeMatches.Any());\n\n            //HELEN ShorterNameLikeMatches\n            Assert.AreEqual(helensMatches.ShorterNameLikeMatches.Count, 3);\n            Assert.IsTrue(helensMatches.ShorterNameLikeMatches.Any(m =&gt; m.Name == &quot;HELEN VAN&quot;));\n            Assert.IsTrue(helensMatches.ShorterNameLikeMatches.Any(m =&gt; m.Name == &quot;VAN DAM&quot;));\n            Assert.IsTrue(helensMatches.ShorterNameLikeMatches.Any(m =&gt; m.Name == &quot;HELEN&quot;));\n\n            //HELEN partial name matches\n            Assert.IsTrue(helensMatches.PartialNameMatches.Any(m =&gt; m.Name == &quot;VAN DAM&quot;));\n\n            var names = new NpiUnprocessedNamePair[] { new NpiUnprocessedNamePair() { FirstName = &quot;HELEN VAN DAM&quot;, LastName = &quot;SMITH&quot; } };\n\n\n            List&lt;NameAndLinkedNames&gt; lastNames = new List&lt;NameAndLinkedNames&gt;()\n            {\n                 new NameAndLinkedNames()\n                 {\n                     Name = &quot;SMITH&quot;, \n                     ExactMatches = new List&lt;int&gt; {98989898}\n                 },\n                 new NameAndLinkedNames()\n                 {\n                     Name = &quot;SMITHY&quot;, \n                     ExactMatches = new List&lt;int&gt; {49999997}\n                 },\n                 new NameAndLinkedNames()\n                 {\n                     Name = &quot;SMIT&quot;, \n                     ExactMatches = new List&lt;int&gt; {555}\n                 },\n                 new NameAndLinkedNames()\n                 {\n                     Name = &quot;SM&quot;, \n                     ExactMatches = new List&lt;int&gt; {1111}\n                 },\n            };\n\n            lastNames = NameAssociatorService.FindLinkedNames(lastNames, nameVariationsDictionary);\n\n            var results = NameJoinerService.PerformFinalTranslationOnProcessedResults(names, firstNames, lastNames);\n\n            //verify counts\n            Assert.AreEqual(results.Count, 1);\n            Assert.AreEqual(results[0].AdditionalMatches.Count, 1);\n            Assert.AreEqual(results[0].AdditionalMatchesByBrokenUpNameMatch.Count, 1);\n            Assert.AreEqual(results[0].AssociatedNpiEntriesByPartialNameVariation.Count, 1);\n            Assert.AreEqual(results[0].ExactMatches.Count, 1);\n\n            //verify name\n            Assert.AreEqual(results[0].FirstName, &quot;HELEN VAN DAM&quot;);\n            Assert.AreEqual(results[0].LastName, &quot;SMITH&quot;);\n\n            //verify date\n            Assert.IsTrue(results[0].AdditionalMatches[0] == 1111);\n            Assert.IsTrue(results[0].AdditionalMatchesByBrokenUpNameMatch[0] == 555);\n            Assert.IsTrue(results[0].AssociatedNpiEntriesByPartialNameVariation[0] == 49999997);\n            Assert.IsTrue(results[0].ExactMatches[0] == 98989898);\n\n\n\n        }\n\n    }\n}</code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-c#"><code class="language-c#">using System.Collections.Generic;\nusing System.IO;\nusing DBBuilder.Data;\nusing Microsoft.VisualStudio.TestTools.UnitTesting;\n\nnamespace DBBuilder.Business.Test\n{\n    [TestClass]\n    public class TestIntersectionOfFirstNameAndLastNameLookups\n    {\n        [TestMethod]\n        public void TestIntersectionWithVariedData()\n        {\n            ProcessNpiMonthlyFile.LeaveStreamsOpen = true;\n\n            using (MemoryStream ms = new MemoryStream())\n            {\n                List&lt;NpiUnprocessedNamePair&gt; npiUnprocessedNames = new List&lt;NpiUnprocessedNamePair&gt;\n                {\n                    new NpiUnprocessedNamePair()\n                    {\n                        FirstName = &quot;JOHN-TODD&quot;,\n                        LastName = &quot;SMITH-JOHNNIE&quot;\n                    },\n                    new NpiUnprocessedNamePair()\n                    {\n                        FirstName = &quot;JOHN-TODD&quot;,\n                        LastName = &quot;HOWARD&quot;\n                    }\n                };\n\n\n                NpiProcessedNames firstNameProcessedNames = new NpiProcessedNames()\n                {\n                    NameDataStore = new List&lt;NpiProcessedName&gt;()\n                    {\n                        new NpiProcessedName()\n                        {\n                            Name = &quot;JOHN-TODD&quot;,\n                            ExactMatches = new List&lt;int&gt; { 1, 99 }, //JOHN-TODD\n                            AdditionalMatches = new List&lt;int&gt; { 2 }, //JOHN-TODDLER\n                            AdditionalMatchesByBrokenUpNameMatch = new List&lt;int&gt; {3, 4, 9}, //TODD and TIM\n                            AssociatedNpiEntriesByPartialNameVariation = new List&lt;int&gt; { 5 } //JOHNNIE\n                        }\n                    },\n                    LookupIndexesForNameDataStore = new Dictionary&lt;string, int&gt;()\n                    {\n                        { &quot;JOHN-TODD&quot;, 0 }\n                    }\n\n                };\n                NpiProcessedNames lastNameProcessedNames = new NpiProcessedNames() \n                {\n                    NameDataStore = new List&lt;NpiProcessedName&gt;()\n                    {\n                        new NpiProcessedName()\n                        {\n                            Name = &quot;SMITH-JOHNNIE&quot;,\n                            ExactMatches = new List&lt;int&gt; { 1, 9, 99 }, //SMITH-JOHNNIE\n                            AdditionalMatches = new List&lt;int&gt; { 2, 3, 99 }, //SMITHY and TODD\n                            AdditionalMatchesByBrokenUpNameMatch = new List&lt;int&gt; { 5, 99, 9 },\n                            AssociatedNpiEntriesByPartialNameVariation = new List&lt;int&gt; { 99 }\n                        },\n                        new NpiProcessedName()\n                        {\n                            Name = &quot;HOWARD&quot;,\n                            ExactMatches = new List&lt;int&gt; { 99 }, //HOWARD\n                            AdditionalMatches = new List&lt;int&gt; { 777, 888, 2 }, //HOWARDEN and HOWIE\n                            AdditionalMatchesByBrokenUpNameMatch = new List&lt;int&gt; {  },\n                            AssociatedNpiEntriesByPartialNameVariation = new List&lt;int&gt; {  }\n                        }\n                    },\n                    LookupIndexesForNameDataStore = new Dictionary&lt;string, int&gt;()\n                    {\n                        { &quot;SMITH-JOHNNIE&quot;, 0 },\n                        { &quot;HOWARD&quot;, 1 }\n                    }\n                };\n\n\n                var results = ProcessNpiMonthlyFile.ProduceAndSaveCompletedNpiSearchLookup(ms, npiUnprocessedNames, firstNameProcessedNames, lastNameProcessedNames);\n\n                using (var sr = new StreamReader(ms))\n                {\n                    ms.Position = 0;\n                    var csvRow = sr.ReadLine();\n\n                    //1 and 99 are exact matches in both (99 is a name broken up match in lastnames but exact matches trump last names)\n                    //2 is an additional match in both\n                    //3 is a name broken up match in firstnames and 3 is a additional match in lastnames (broken up matches trumps additional matches)\n                    //9 is a name broken up match in both and also an exact match in last names (therefore it is a name broken up match)\n                    //5 is a name broken up variation match in firstnames and is a standard name broken up match in lastnames\n\n                    //4 only exists in firstnames which is why it doesn&#39;t exist in the output\n\n                    Assert.AreEqual(@&quot;JOHN-TODD,SMITH-JOHNNIE,&quot;&quot;1,99&quot;&quot;,2,&quot;&quot;3,9&quot;&quot;,5&quot;, csvRow);\n\n\n                    csvRow = sr.ReadLine();\n\n                    Assert.AreEqual(@&quot;JOHN-TODD,HOWARD,99,2,,&quot;, csvRow);\n                };\n            }\n        }\n    }\n}</code></pre>\n      </div>\n<p>Sample code from the NameAssociatorService.cs</p>\n<div class="gatsby-highlight">\n      <pre class="language-c#"><code class="language-c#">using System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing DBBuilder.Core.Extensions;\nusing DBBuilder.Data;\nusing NPIAPI.Data;\n\nnamespace DBBuilder.Business.Services.Stage1SingleName\n{\n    public class NameAssociatorService\n    {\n        public static List&lt;NpiSplitNameUnprocessed&gt; FindLinkedNamesViaPartialPieceMatch(List&lt;NpiSplitNameUnprocessed&gt; unprocessedSplitNames, List&lt;NameAndLinkedNames&gt; peopleWithFullNamesEqualToAPartialPiece)\n        {\n            //process partial to partial\n            List&lt;NpiSplitNameUnprocessed&gt; allUnprocessedSplitNames = unprocessedSplitNames;\n            unprocessedSplitNames = unprocessedSplitNames.AsParallel().Select(thisPerson =&gt;\n                {\n                    thisPerson.MatchedPeopleByPartialToPartialNameMatch = allUnprocessedSplitNames.Where(otherPerson =&gt;\n                        {\n                            bool isOtherPersonRelated = otherPerson.ThisPerson != thisPerson.ThisPerson &amp;&amp; thisPerson.NamePieces.Intersect(otherPerson.NamePieces).Any();\n                            return isOtherPersonRelated;\n                        }).Select(o =&gt; o.ThisPerson).ToList();\n\n                    return thisPerson;\n                }).ToList();\n\n            //process partial to full name\n            unprocessedSplitNames = unprocessedSplitNames.AsParallel().Select(thisPerson =&gt;\n                {\n                    thisPerson.MatchedPeopleByPartialToFullNameMatch = peopleWithFullNamesEqualToAPartialPiece.Where(otherPerson =&gt;\n                        thisPerson.NamePieces.Contains(otherPerson.Name)).ToList();\n\n                    return thisPerson;\n                }).ToList();\n\n\n            return unprocessedSplitNames;\n        }\n\n        public static List&lt;NpiSplitNameUnprocessed&gt; FindLinkedNamesViaPartialVariationPieceMatch(List&lt;NpiSplitNameUnprocessed&gt; unprocessedSplitNames, List&lt;NameAndLinkedNames&gt; peopleWithFullNamesEqualToAVariationOfAPartialPiece, Dictionary&lt;string, HashSet&lt;string&gt;&gt; nameVariationLookup)\n        {\n            List&lt;NpiSplitNameUnprocessed&gt; unprocessedSplitNamesWithVariations = unprocessedSplitNames.Where(up =&gt; up.NamePieceVariations.Any()).ToList();\n            List&lt;NpiSplitNameUnprocessed&gt; unprocessedSplitNamesWithNoVariations = unprocessedSplitNames.Except(unprocessedSplitNamesWithVariations).ToList();\n            List&lt;NpiSplitNameUnprocessed&gt; allUnprocessedSplitNames = unprocessedSplitNames;\n\n            //process partial variation to partial\n            unprocessedSplitNamesWithVariations = unprocessedSplitNamesWithVariations.AsParallel().Select(thisPerson =&gt;\n            {\n                thisPerson.MatchedPeopleByPartialVariationToPartialNameMatch = allUnprocessedSplitNames.Where(otherPerson =&gt;\n                    {\n                        bool isOtherPersonRelated = otherPerson.ThisPerson != thisPerson.ThisPerson &amp;&amp; thisPerson.NamePieceVariations.Any(nv =&gt; otherPerson.NamePieces.Any(onp =&gt; nameVariationLookup[nv].Contains(onp)));\n                        return isOtherPersonRelated;\n                    }).Select(o =&gt; o.ThisPerson).ToList();\n\n                return thisPerson;\n            }).ToList();\n\n            //process partial variation to full name\n            unprocessedSplitNamesWithVariations = unprocessedSplitNamesWithVariations.AsParallel().Select(thisPerson =&gt;\n            {\n                thisPerson.MatchedPeopleByPartialVariationToFullNameMatch = peopleWithFullNamesEqualToAVariationOfAPartialPiece.Where(otherPerson =&gt;\n                    thisPerson.NamePieceVariations.Any(nv =&gt; nameVariationLookup[nv].Contains(otherPerson.Name))).ToList();\n\n                return thisPerson;\n            }).ToList();\n\n            return unprocessedSplitNamesWithVariations.Concat(unprocessedSplitNamesWithNoVariations).ToList();\n        }\n\n        public static List&lt;NameAndLinkedNames&gt; FindLinkedNames(List&lt;NameAndLinkedNames&gt; uniqueNamesAndExactMatches, Dictionary&lt;string, HashSet&lt;string&gt;&gt; nameVariationLookup)\n        {\n            List&lt;NameAndLinkedNames&gt; results;\n\n            Console.WriteLine(@&quot;uniqueNamesAndExactMatches count: {0}&quot;, uniqueNamesAndExactMatches.Count);\n\n            //process normal names using standard smart like match\n            {\n                NamesGroupedByNameCharLength[] uniqueFirstnamesAndExactMatchesGroupedByNameLength = uniqueNamesAndExactMatches.AsParallel()\n                    .GroupBy(n =&gt; n.Name.Length)\n                    .Select(n =&gt; new NamesGroupedByNameCharLength() { NameCharLength = n.Key, AllNamesAtThisCharLength = n.Select(k =&gt; k).ToList() })\n                    .OrderBy(n =&gt; n.NameCharLength)\n                    .ToArray();\n\n                results = NameAssociatorService.FindLinkedNamesWithSmartLikeMatch(uniqueFirstnamesAndExactMatchesGroupedByNameLength);\n\n                Console.WriteLine(@&quot;namesAssociatedWithSmartLikeMatch count: {0}&quot;, results.Count);\n            }\n\n\n            //process broken piece names using standard smart like match\n            {\n                List&lt;NameAndLinkedNames&gt; peopleWithNamesThatCanBeBrokenUp = results.AsParallel().Where(s =&gt; s.Name.NameCanBeSplitOrIsInitial()).ToList();\n                Console.WriteLine(@&quot;peopleWithNamesThatCanBeBrokenUp count: {0}&quot;, peopleWithNamesThatCanBeBrokenUp.Count);\n\n                //remove from results\n                results = results.Except(peopleWithNamesThatCanBeBrokenUp).ToList();\n\n                //process broken piece names further and finally add the processed results \n                HashSet&lt;string&gt; allUniqueNamePieces =\n                    new HashSet&lt;string&gt;(peopleWithNamesThatCanBeBrokenUp.AsParallel().SelectMany(s =&gt; s.Name.SplitNameIntoPieces()).Distinct());\n                Console.WriteLine(@&quot;allUniqueNamePieces count: {0}&quot;, allUniqueNamePieces.Count);\n\n                HashSet&lt;string&gt; allUniqueNamePieceVariations = new HashSet&lt;string&gt;(allUniqueNamePieces.Where(nameVariationLookup.ContainsKey).SelectMany(namePiece =&gt; nameVariationLookup[namePiece]));\n                Console.WriteLine(@&quot;allUniqueNamePieceVariations count: {0}&quot;, allUniqueNamePieceVariations.Count);\n\n                List&lt;NameAndLinkedNames&gt; peopleWithFullNamesEqualToAPartialPiece = uniqueNamesAndExactMatches.Except(peopleWithNamesThatCanBeBrokenUp).AsParallel().Where(s =&gt; allUniqueNamePieces.Contains(s.Name)).ToList();\n                Console.WriteLine(@&quot;peopleWithFullNamesEqualToAPartialPiece count: {0}&quot;, peopleWithFullNamesEqualToAPartialPiece.Count);\n\n                List&lt;NameAndLinkedNames&gt; peopleWithFullNamesEqualToAVariationOfAPartialPiece = uniqueNamesAndExactMatches.Except(peopleWithNamesThatCanBeBrokenUp).AsParallel().Where(s =&gt; allUniqueNamePieceVariations.Contains(s.Name)).ToList();\n                Console.WriteLine(@&quot;peopleWithFullNamesEqualToAVariationOfAPartialPiece count: {0}&quot;, peopleWithFullNamesEqualToAVariationOfAPartialPiece.Count);\n\n                //ready data (all these people have already been filtered from peopleWithNamesThatCanBeBrokenUp)\n                List&lt;NpiSplitNameUnprocessed&gt; readiedDataForSplitNameMatches = peopleWithNamesThatCanBeBrokenUp.AsParallel().Select(thisPerson =&gt;\n                {\n                    var thisPersonsNamePieces = thisPerson.Name.SplitNameIntoPieces().ToList();\n                    var thisPersonsNamePieceVariations = thisPersonsNamePieces.Where(nameVariationLookup.ContainsKey).ToList();\n                    return new NpiSplitNameUnprocessed { ThisPerson = thisPerson, NamePieces = thisPersonsNamePieces, NamePieceVariations = thisPersonsNamePieceVariations };\n                }).ToList();\n\n                //process non-variation\n                readiedDataForSplitNameMatches = FindLinkedNamesViaPartialPieceMatch(readiedDataForSplitNameMatches, peopleWithFullNamesEqualToAPartialPiece);\n\n                //process variation\n                readiedDataForSplitNameMatches = FindLinkedNamesViaPartialVariationPieceMatch(readiedDataForSplitNameMatches, peopleWithFullNamesEqualToAVariationOfAPartialPiece, nameVariationLookup);\n\n                //add to main list\n                results.AddRange(readiedDataForSplitNameMatches.Select(Mappers.MapFrom));\n            }\n\n            //process all names using standard variation match\n            {\n                //get from results\n                NameAndLinkedNames[] peopleWithNameVariations = results.Where(s =&gt; nameVariationLookup.ContainsKey(s.Name)).ToArray();\n\n                Console.WriteLine(@&quot;peopleWithNameVariations count: {0}&quot;, peopleWithNameVariations.Length);\n\n                //remove from results\n                results = results.Except(peopleWithNameVariations).ToList();\n\n                //process\n                NameAndLinkedNames[] processedPeopleWithNameVariations = peopleWithNameVariations.AsParallel().Select(thisPerson =&gt;\n                {\n                    HashSet&lt;string&gt; variations = nameVariationLookup[thisPerson.Name];\n\n                    List&lt;NameAndLinkedNames&gt; relatedPeopleByNameVariation = peopleWithNameVariations.Where(otherPerson =&gt; variations.Contains(otherPerson.Name)).ToList();\n\n                    thisPerson.NameVariationMatches = relatedPeopleByNameVariation;\n\n                    return thisPerson;\n\n                }).ToArray();\n\n                //add back to results\n                results.AddRange(processedPeopleWithNameVariations);\n\n                Console.WriteLine(@&quot;processedPeopleWithNameVariations count: {0}&quot;, results.Count);\n            }\n\n            return results;\n        }\n\n        private static List&lt;NameAndLinkedNames&gt; FindLinkedNamesWithSmartLikeMatch(NamesGroupedByNameCharLength[] namesOrderedByNameLengthAsc)\n        {\n            if (namesOrderedByNameLengthAsc == null || namesOrderedByNameLengthAsc.Length &lt; 1)\n            {\n                return new List&lt;NameAndLinkedNames&gt;();\n            }\n\n            int lastIndex = namesOrderedByNameLengthAsc.Length - 1;\n            Console.WriteLine(@&quot;Shortest name length: {0}&quot;, namesOrderedByNameLengthAsc[0].NameCharLength);\n            Console.WriteLine(@&quot;Longest name length: {0}&quot;, namesOrderedByNameLengthAsc[lastIndex].NameCharLength);\n\n            for (int i = 0; i &lt; namesOrderedByNameLengthAsc.Length; i++)\n            {\n                int nameLength = namesOrderedByNameLengthAsc[i].NameCharLength;\n\n                if (nameLength &lt; 2)\n                {\n                    continue;\n                }\n\n                Console.WriteLine(@&quot;Starting processing of all names with name char length of : {0}&quot;, nameLength);\n\n                List&lt;NameAndLinkedNames&gt; allNamesAtThisCharLength = namesOrderedByNameLengthAsc[i].AllNamesAtThisCharLength;\n\n                int indexOfNext = i + 1;\n                int countOfRemainingElementsAfterNext = namesOrderedByNameLengthAsc.Length - (indexOfNext);\n\n                ArraySegment&lt;NamesGroupedByNameCharLength&gt;? allShorterNames = null, allLongerNames = null;\n                bool processShortNames = false, processLongerNames = false;\n\n                if (i &gt; 0)\n                {\n                    allShorterNames = new ArraySegment&lt;NamesGroupedByNameCharLength&gt;(namesOrderedByNameLengthAsc, 0, i);\n                    processShortNames = true;\n                }\n\n                if (i &lt; lastIndex)\n                {\n                    allLongerNames = new ArraySegment&lt;NamesGroupedByNameCharLength&gt;(namesOrderedByNameLengthAsc, indexOfNext, countOfRemainingElementsAfterNext);\n                    processLongerNames = true;\n                }\n\n\n                if (processShortNames &amp;&amp; processLongerNames)\n                {\n                    namesOrderedByNameLengthAsc[i].AllNamesAtThisCharLength = allNamesAtThisCharLength.AsParallel().Select(thisPerson =&gt;\n                    {\n                        string thisPersonsName = thisPerson.Name;\n                        thisPerson.ShorterNameLikeMatches = allShorterNames.Value.SelectMany(s =&gt; s.AllNamesAtThisCharLength)\n                                .Where(personWithShorterName =&gt; thisPersonsName.StringContainsFast(personWithShorterName.Name)).ToList();\n\n                        thisPerson.LongerNameLikeMatches = allLongerNames.Value.SelectMany(s =&gt; s.AllNamesAtThisCharLength)\n                                .Where(personWithLongerName =&gt; personWithLongerName.Name.StringContainsFast(thisPersonsName)).ToList();\n\n                        return thisPerson;\n                    }).ToList();\n                }\n                else if (processShortNames)\n                {\n                    namesOrderedByNameLengthAsc[i].AllNamesAtThisCharLength = allNamesAtThisCharLength.AsParallel().Select(thisPerson =&gt;\n                    {\n                        string thisPersonsName = thisPerson.Name;\n                        thisPerson.ShorterNameLikeMatches = allShorterNames.Value.SelectMany(s =&gt; s.AllNamesAtThisCharLength)\n                                .Where(personWithShorterName =&gt; thisPersonsName.StringContainsFast(personWithShorterName.Name)).ToList();\n\n                        return thisPerson;\n                    }).ToList();\n                }\n                else if (processLongerNames)\n                {\n                    namesOrderedByNameLengthAsc[i].AllNamesAtThisCharLength = allNamesAtThisCharLength.AsParallel().Select(thisPerson =&gt;\n                    {\n                        string thisPersonsName = thisPerson.Name;\n                        thisPerson.LongerNameLikeMatches = allLongerNames.Value.SelectMany(s =&gt; s.AllNamesAtThisCharLength)\n                                .Where(personWithLongerName =&gt; personWithLongerName.Name.StringContainsFast(thisPersonsName)).ToList();\n\n                        return thisPerson;\n\n                    }).ToList();\n                }\n            }\n\n            List&lt;NameAndLinkedNames&gt; results = namesOrderedByNameLengthAsc.AsParallel().SelectMany(n =&gt; n.AllNamesAtThisCharLength).ToList();\n\n            return results;\n        }\n    }\n}</code></pre>\n      </div>\n<h2>Attaching multiple databases</h2>\n<p>On the device itself, there was a filesystem limitation of 2GB per file. I had to attach multiple SQLite databases to avoid the 2GB file size limitation. See PhoneGap plugin JavaScript code below:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript">self<span class="token punctuation">.</span>db <span class="token operator">=</span> window<span class="token punctuation">.</span>sqlitePlugin<span class="token punctuation">.</span><span class="token function">openDatabase</span><span class="token punctuation">(</span><span class="token string">"npi-lookup-database-v2.db"</span><span class="token punctuation">,</span> <span class="token string">"1.0"</span><span class="token punctuation">,</span> <span class="token string">"lookup"</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\nself<span class="token punctuation">.</span>db<span class="token punctuation">.</span><span class="token function">executeSql</span><span class="token punctuation">(</span><span class="token string">"ATTACH DATABASE \'/sdcard/npi-datastore-database1.db\' as \'datastore1\';"</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> undefined<span class="token punctuation">,</span> self<span class="token punctuation">.</span>forceUserToRedownloadDatabases<span class="token punctuation">)</span><span class="token punctuation">;</span>\nself<span class="token punctuation">.</span>db<span class="token punctuation">.</span><span class="token function">executeSql</span><span class="token punctuation">(</span><span class="token string">"ATTACH DATABASE \'/sdcard/npi-datastore-database2.db\' as \'datastore2\';"</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> undefined<span class="token punctuation">,</span> self<span class="token punctuation">.</span>forceUserToRedownloadDatabases<span class="token punctuation">)</span><span class="token punctuation">;</span>\nself<span class="token punctuation">.</span>db<span class="token punctuation">.</span><span class="token function">executeSql</span><span class="token punctuation">(</span><span class="token string">"ATTACH DATABASE \'/sdcard/npi-datastore-database3.db\' as \'datastore3\';"</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> undefined<span class="token punctuation">,</span> self<span class="token punctuation">.</span>forceUserToRedownloadDatabases<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>Querying those three databases, using UNION ALL</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript">Database<span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">queryDatabaseByNpiNumber</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>npinumber<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> self <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span>\n    <span class="token keyword">var</span> commonSqlSelectStatement <span class="token operator">=</span> <span class="token string">\'\'</span> <span class="token operator">+</span>\n        <span class="token string">\' SELECT rowid, NPI, ProviderFirstName, ProviderMiddleName, ProviderLastNameLegalName, ProviderFirstLineBusinessMailingAddress, ProviderSecondLineBusinessMailingAddress,\'</span> <span class="token operator">+</span>\n        <span class="token string">\' ProviderBusinessMailingAddressCityName, ProviderBusinessMailingAddressStateName, ProviderBusinessMailingAddressPostalCode, ProviderBusinessMailingAddressCountryCodeIfoutsideUS \'</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">var</span> fromDataStore1 <span class="token operator">=</span> <span class="token string">\'\'</span> <span class="token operator">+</span>\n        <span class="token string">\' FROM datastore1.NPI WHERE NPI = ?1 UNION ALL \'</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">var</span> fromDataStore2 <span class="token operator">=</span> <span class="token string">\'\'</span> <span class="token operator">+</span>\n        <span class="token string">\' FROM datastore2.NPI WHERE NPI = ?1 UNION ALL \'</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">var</span> fromDataStore3 <span class="token operator">=</span> <span class="token string">\'\'</span> <span class="token operator">+</span>\n        <span class="token string">\' FROM datastore3.NPI WHERE NPI = ?1 LIMIT 1;\'</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">var</span> sqlStatement <span class="token operator">=</span> commonSqlSelectStatement <span class="token operator">+</span> fromDataStore1 <span class="token operator">+</span> commonSqlSelectStatement <span class="token operator">+</span> fromDataStore2 <span class="token operator">+</span> commonSqlSelectStatement <span class="token operator">+</span> fromDataStore3<span class="token punctuation">;</span>\n\n    <span class="token keyword">return</span> sqlStatement<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<h2>In summary</h2>\n<p>It is possible to have a fast/usable large database on an underpowered mobile device. However, you must arrange the data in a way that the device can retrieve what it needs with minimal effort. The tablet requires a bespoke database explicitly designed with its usage in mind.</p>',
fields:{slug:"/phonegap-large-sqlitedatabase/",prefix:"2017-10-05"},frontmatter:{title:"Creating an Android app, with a large offline database (over 4GB)",subTitle:"Today we will be covering large SQLite databases with the Android PhoneGap framework. We will be going over the challenges and opportunities of running offline Android apps with scale.",cover:{childImageSharp:{resize:{src:"/static/npi-search-logo-d66615b732cf9738ca10f5d63d38e5a6-160fa.png"}}}}},author:{id:"/root/project/content/parts/author.md absPath of file >>> MarkdownRemark",html:"<p><strong>Paul S. Ness</strong> Software engineer with ten years of experience in a variety of industries such travel, payments, medical and publishing.</p>"},footnote:{id:"/root/project/content/parts/footnote.md absPath of file >>> MarkdownRemark",html:""},site:{siteMetadata:{facebook:{appId:""}}}},pathContext:{slug:"/phonegap-large-sqlitedatabase/"}}}});
//# sourceMappingURL=path---phonegap-large-sqlitedatabase-244ba607a9e7739da889.js.map