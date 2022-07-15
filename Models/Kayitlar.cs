using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;


namespace Formv7.Models
{
    public class Kayitlar
    {
        [Key]
        public int PersonelId { get; set; }
        public string Isim { get; set; }
        public string Soyisim { get; set; }
        public string Email { get; set; }
        [DataType(DataType.Date)]
        public string Dogumgunu { get; set; }
        public string Cinsiyet { get; set; }
        public string DogumYeriUlke { get; set; }
        public string DogumYeriSehir { get; set; }
        public string Not { get; set; }
        public int MediaID { get; set; }
        public bool Aktif { get; set; }
        public bool Pasif { get; set; }
        public int[] Pozisyon { get; set; }


    }
}
