using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Formv7.Models
{
    public class Okul
    {   
        public int id { get; set; }
        public string OkulAdi { get; set; }
        public string OkulTuru { get; set; }
        [DataType(DataType.Date)]
        public string MYili { get; set; }
        public int PersonelID { get; set; }
        

    }
}
