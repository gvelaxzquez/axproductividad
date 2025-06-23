using System;
using System.Text;
using System.Collections;
using System.DirectoryServices;

namespace CapaDatos
{
    public static class LdapAuthentication
    {
        public static bool IsAuthenticated(String domain, String username, String pwd)
        {

            //String domainAndUsername = domain + @"\" + username;
            //DirectoryEntry entry = new DirectoryEntry("", domainAndUsername, pwd);
            DirectoryEntry entry = new DirectoryEntry(domain, username, pwd);

            try
            {//Bind to the native AdsObject to force authentication.
                Object obj = entry.NativeObject;

                DirectorySearcher search = new DirectorySearcher(entry);

                search.Filter = "(SAMAccountName=" + username + ")";
                search.PropertiesToLoad.Add("cn");
                SearchResult result = search.FindOne();

                if (null == result)
                {
                    return false;
                }

                //   return true;
                //    //Update the new path to the user in the directory.
                //    _path = result.Path;
                //    _filterAttribute = (String)result.Properties["cn"][0];
            }
            catch (Exception ex)
            {
                throw new Exception("Error authenticating user. " + ex.Message);
            }

            return true;

        }
    }
}
