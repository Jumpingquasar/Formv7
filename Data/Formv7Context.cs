using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Formv7.Models;

namespace Formv7.Data
{
    public class Formv7Context : DbContext
    {
        public Formv7Context(DbContextOptions<Formv7Context> options) : base(options) { }

        public DbSet<Cografya> Cografya { get; set; }

        public DbSet<Kayitlar> Kayitlar { get; set; }
        public DbSet<Images> Images { get; set; }

    }
}
