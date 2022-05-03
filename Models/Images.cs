using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Formv7.Models
{
    public class Images
    {
        [Key]
        public string MediaID { get; set; }
        public string MediaName { get; set; }
        public string MediaURL { get; set; }

    }
}
