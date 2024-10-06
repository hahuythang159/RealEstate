using System;
using System.Security.Cryptography;
using System.Text;



    public static class HashPassword
    {
        public static string Hash(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }
    }

