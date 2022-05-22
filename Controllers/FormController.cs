using Formv7.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Formv7.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Web;
using System.Net.Http.Headers;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Builder;

namespace Formv7.Controllers
{
    public class FormController : Controller
    {
        private readonly Formv7Context _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public FormController(Formv7Context context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;

        }
        public IActionResult KayitFormu()
        {
            return View();
        }
        public IActionResult Personel()
        {
            return View();
        }

        [HttpGet]
        public List<Cografya> GetCountry()
        {
            var data = _context.Cografya.Where(x => x.UstID == 0).ToList();
            return data;
        }

        [HttpGet]
        public List<Cografya> GetCity(int value)
        {
            if (value != 0)
            {
                var data = _context.Cografya.Where(x => x.UstID == value).ToList();
                return data;

            }
            return null;
        }

        [HttpGet]
        public List<Okulturu> GetSchool()
        {
            var data = _context.Okulturu.ToList();
            return data;
        }

        [HttpPost]
        public int KayitPost(Kayitlar formlistesi)
        {
            int PersonelID = 0;
            Kayitlar formsonucu = new Kayitlar()
            {
                Isim = formlistesi.Isim,
                Soyisim = formlistesi.Soyisim,
                Dogumgunu = formlistesi.Dogumgunu,
                Cinsiyet = formlistesi.Cinsiyet,
                DogumYeriUlke = formlistesi.DogumYeriUlke,
                DogumYeriSehir = formlistesi.DogumYeriSehir,
                Not = formlistesi.Not,
                MediaID = formlistesi.MediaID,
            };
            _context.Kayitlar.Add(formsonucu);
            _context.SaveChanges();

            PersonelID = formsonucu.id;

            return PersonelID;
        }

        [HttpPost]
        public int UploadFile(IFormFile ImageUploader)
        {
            int Id = 0;
            if (ImageUploader != null)
            {
                string MediaName = Guid.NewGuid() + " - " + ImageUploader.FileName;

                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "Image");
                string FilePath = Path.Combine(uploadsFolder, MediaName);

                using (var fileStream = new FileStream(FilePath, FileMode.Create))
                {
                    ImageUploader.CopyTo(fileStream);
                }

                Images ImageList = new Images()
                {
                    MediaName = MediaName,
                    MediaURL = FilePath,
                };

                _context.Images.Add(ImageList);
                _context.SaveChanges();
                Id = ImageList.MediaID;
            }
            return Id;
        }

        [HttpPost]
        public void OkulPost(Okul okullistesi)
        {
            Okul okulsonucu = new Okul()
            {
                OkulTuru = okullistesi.OkulTuru,
                OkulAdi = okullistesi.OkulAdi,
                MYili = okullistesi.MYili,
                PersonelID = okullistesi.PersonelID
            };
            _context.Okul.Add(okulsonucu);
            _context.SaveChanges();
            
        }
    }
}


