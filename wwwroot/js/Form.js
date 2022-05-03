$(document).ready(function () {
    GetCountry();
    CalendarDate();
});

$("#Country").on("change", function () {
        var selected_country = $("#Country").val();
        GetCity(selected_country);
});

$("#FormFileID").change(function () {
    const [file] = FormFileID.files
    if (file) {
        preview.src = URL.createObjectURL(file)
    }
});

$("#Submit").click(function () {
    'use strict'
    var forms = document.querySelectorAll('.needs-validation')
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                }
                else {
                    uploadFile();
                    KayitPost();
                    
                }
                form.classList.add('was-validated')
            },  false)
            
        })
    
});

function GetCountry() {

    $.ajax({
        type: "Get",
        url: "/Form/GetCountry",
        dataType: "json",
        async: false,
        success: function (result) {
            console.log(result)
            for (let i = 0; i < result.length; i++) {
                x = "<option value=" + result[i].id + ">" + result[i].tanim + "</option>";
                $("#Country").append(x);
            }


        }
    })
};

function GetCity(countryid) {

    $.ajax({
        type: "Get",
        url: "/Form/GetCity/",
        dataType: "json",
        data: {value: countryid},
        async: false,
        success: function (result) {
            $("#City").empty();
            $("#City").append("<option>Seçiniz</option>");
            console.log(result)
            if (result != null) {
                for (var i = 0; i < result.length; i++) {
                    x = "<option value=" + result[i].id + ">" + result[i].tanim + "</option>";
                    $("#City").append(x);
                }
            
            }        
        
        }      
    
    })
};

function KayitPost() {

    var Isim = $("#Isim").val();
    var Soyisim = $("#Soyisim").val();
    var Dogumgunu = $("#Dogumgunu").val();

    if ($("#cinsiyet1").is(":checked")) {
        var Cinsiyet = $("#cinsiyet1").val();
    }

    else if ($("#cinsiyet2").is(":checked")) {
        var Cinsiyet = $("#cinsiyet2").val();
    }

    else if ($("#cinsiyet3").is(":checked")) {
        var Cinsiyet = $("#cinsiyet3").val();
    }

    else {
        var Cinsiyet = $("#cinsiyet4_text").val();
    }

    var Country = $("#Country option:selected").val();
    var City = $("#City option:selected").val();
    var Not = $("#Not").val();

    var Kayit = {};

    Kayit["Isim"] = Isim;
    Kayit["Soyisim"] = Soyisim;
    Kayit["Dogumgunu"] = Dogumgunu;
    Kayit["Cinsiyet"] = Cinsiyet;
    Kayit["DogumYeriUlke"] = Country;
    Kayit["DogumYeriSehir"] = City;
    Kayit["Not"] = Not;

    $.ajax({
        type: "Post",
        url: "/Form/KayitPost/",
        dataType: "json",
        data: { formlistesi : Kayit },
        async: false,
        success: function () {

        }
    })
    alert("Kayıt tamamlandı.")
    window.location.href = "/Form/KayitFormu";
    
};

function CalendarDate() {
    Dogumgunu.max = new Date().toISOString().split("T")[0];
}

function uploadFile() {
    var files = $("#FormFileID").prop("files");
    formData = new FormData();
    formData.append("ImageUploader", files[0]);

    $.ajax({
        url: "/Form/UploadFile/",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (result) { alert(result); },
        error: function (err) {
            alert(err.statusText)
        }
    });

};