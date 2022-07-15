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
        public int PersonelID;

        public FormController(Formv7Context context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;

        }
        public IActionResult KayitFormu()
        {
            return View();
        }
        public IActionResult Table()
        {
            return View();
        }
        public IActionResult Update()
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
        public List<Kayitlar> PersonelList()
        {
            var data = _context.Kayitlar.ToList();
            return data;
        }
        [HttpGet]
        public List<Cografya> GetCografya()
        {
            var result = _context.Cografya.ToList();
            return result;
        }
        [HttpGet]
        public List<Images> GetImages()
        {
            var result = _context.Images.ToList();
            return result;
        }


        [HttpGet]
        public List<Okulturu> GetSchool()
        {
            var data = _context.Okulturu.ToList();
            return data;
        }

        [HttpPost]
        public void KayitPost(Kayitlar formlistesi, Okul[] okullistesi)
        {
            Kayitlar formsonucu = new Kayitlar()
            {
                Isim = formlistesi.Isim,
                Soyisim = formlistesi.Soyisim,
                Email = formlistesi.Email,
                Dogumgunu = formlistesi.Dogumgunu,
                Cinsiyet = formlistesi.Cinsiyet,
                DogumYeriUlke = formlistesi.DogumYeriUlke,
                DogumYeriSehir = formlistesi.DogumYeriSehir,
                Not = formlistesi.Not,
                MediaID = formlistesi.MediaID,
                Aktif = formlistesi.Aktif,
                Pasif = formlistesi.Pasif,
                Pozisyon = formlistesi.Pozisyon
            };
            _context.Kayitlar.Add(formsonucu);
            _context.SaveChanges();

            PersonelID = formsonucu.PersonelId;

            

            for (int i=0; i<okullistesi.Length; i++)
            {
                Okul okulsonucu = new Okul()
                {
                    OkulTuru = okullistesi[i].OkulTuru,
                    OkulAdi = okullistesi[i].OkulAdi,
                    MYili = okullistesi[i].MYili,
                    PersonelID = PersonelID
                };
                _context.Okul.Add(okulsonucu);

            }            
            _context.SaveChanges();

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

        [HttpGet]
        public List<Kayitlar> KayitGet(int id)
        {
            var data = _context.Kayitlar.Where(x => x.PersonelId == id).ToList();
            return data;
        }

        [HttpGet]
        public List<Images> ImageGet(int MediaID)
        {
            var ImageData = _context.Images.Where(x => x.MediaID == MediaID).ToList();
            return ImageData;
        }

        public List<Okul> OkulGet(int id)
        {
            var OkulData = _context.Okul.Where(x => x.PersonelID == id).ToList();
            return OkulData;
        }

        public void UpdatePost(Kayitlar formlistesi, Okul[] okullistesi)
        {
            Kayitlar formsonucu = new Kayitlar()
            {
                PersonelId = formlistesi.PersonelId,
                Isim = formlistesi.Isim,
                Soyisim = formlistesi.Soyisim,
                Email = formlistesi.Email,
                Dogumgunu = formlistesi.Dogumgunu,
                Cinsiyet = formlistesi.Cinsiyet,
                DogumYeriUlke = formlistesi.DogumYeriUlke,
                DogumYeriSehir = formlistesi.DogumYeriSehir,
                Not = formlistesi.Not,
                MediaID = formlistesi.MediaID,
                Aktif = formlistesi.Aktif,
                Pasif = formlistesi.Pasif,
                Pozisyon = formlistesi.Pozisyon
            };
            _context.Kayitlar.Update(formsonucu);
            _context.SaveChanges();

            PersonelID = formsonucu.PersonelId;

            for (int i = 0; i < okullistesi.Length; i++)
            {
                if (okullistesi[i].id != 0)
                {
                    Okul okulsonucu = new Okul()
                    {
                        id = okullistesi[i].id,
                        PersonelID = formlistesi.PersonelId,
                        OkulTuru = okullistesi[i].OkulTuru,
                        OkulAdi = okullistesi[i].OkulAdi,
                        MYili = okullistesi[i].MYili,
                    };
                    _context.Okul.Update(okulsonucu);
                }
                else
                {
                    Okul okulsonucu = new Okul()
                    {
                        PersonelID = formlistesi.PersonelId,
                        OkulTuru = okullistesi[i].OkulTuru,
                        OkulAdi = okullistesi[i].OkulAdi,
                        MYili = okullistesi[i].MYili,
                    };
                    _context.Okul.Add(okulsonucu);
                }
                
            }
            _context.SaveChanges();
        }

        public void Delete(Kayitlar data)
        {
            Kayitlar formsonucu = new Kayitlar()
            {
                PersonelId = data.PersonelId,
                Isim = data.Isim,
                Soyisim = data.Soyisim,
                Email = data.Email,
                Cinsiyet = data.Cinsiyet,
                DogumYeriUlke = data.DogumYeriUlke,
                DogumYeriSehir = data.DogumYeriSehir,
                Not = data.Not,
                Dogumgunu = data.Dogumgunu,
                MediaID = data.MediaID,
                Aktif = false,
                Pasif = true,
                Pozisyon = data.Pozisyon
            };
            _context.Kayitlar.Update(formsonucu);
            _context.SaveChanges();
        }
    }
}


