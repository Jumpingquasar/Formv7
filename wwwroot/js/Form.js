$(document).ready(function () {
    GetCountry();
    CalendarDate();
    GetSchool();
    counter = 0
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
    uploadFile();
});

$("#Add").click(function () {
    if (counter == 4) {
        alert("Daha fazla okul ekleyemezsiniz.")
        console.log($("#AddSchool").serializeArray());
        return
    };
    counter += 1
    $(".AddSchool").append(
        `<div class="row pt-2" id="OkulRow` + counter + `">
            <div class="col-md-3">
                <select class="form-select" id="Okul` + counter + `" required>
                </select>
            </div>
            <div class="col-md-5">
                <input type="text" class="form-control" id="OkulAdi` + counter + `" required>
            </div>
            <div class="col-md-2">
                <input class="form-control" type="date" id="MYili` + counter + `" min="1900-01-01" max="" required>
            </div>
            <div class="col-md-1">
                <button type="button" id="OkulSil` + counter + `" class="btn btn-warning" onclick=OkulSil(` + counter + `)>Sil</button>
            </div>
        </div>`
    );
    var $options = $("#Okul0 > option").clone();
    $('#Okul' + counter).append($options);
});

$("#Submit").click((function () {
    KayitPost();
    return false;
}))

function OkulSil(OkulSil) {
    $("#OkulRow" + OkulSil).remove()
};

function GetCountry() {

    $.ajax({
        type: "Get",
        url: "/Form/GetCountry",
        dataType: "json",
        async: false,
        success: function (result) {
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
            if (result != null) {
                for (var i = 0; i < result.length; i++) {
                    x = "<option value=" + result[i].id + ">" + result[i].tanim + "</option>";
                    $("#City").append(x);
                }
            
            }        
        
        }      
    
    })
};

function GetSchool() {

    $.ajax({
        type: "Get",
        url: "/Form/GetSchool",
        dataType: "json",
        async: false,
        success: function (result) {
            for (let i = 0; i < result.length; i++) {
                x = "<option value=" + result[i].id + ">" + result[i].tur + "</option>";
                $("#Okul0").append(x);
            }
        }
    })
};

function KayitPost() {
    var Isim = $("#Isim").val();
    var Soyisim = $("#Soyisim").val();
    var Email = $("#email").val();
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
    var Aktif = true;
    var Pasif = false;

    
    var Kayit = {};
    var Pozisyon = $("#Pozisyon").val();
    var OkulKayitlari = [];

    Kayit["Isim"] = Isim;
    Kayit["Soyisim"] = Soyisim;
    Kayit["Email"] = Email;
    Kayit["Dogumgunu"] = Dogumgunu;
    Kayit["Cinsiyet"] = Cinsiyet;
    Kayit["DogumYeriUlke"] = Country;
    Kayit["DogumYeriSehir"] = City;
    Kayit["Not"] = Not;
    Kayit["MediaID"] = MediaID;
    Kayit["Aktif"] = Aktif;
    Kayit["Pasif"] = Pasif;
    Kayit["Pozisyon"] = Pozisyon;


    while (counter !== -1) {
        var OkulTuru = $("#Okul" + counter + " option:selected").val();
        var OkulAdi = $("#OkulAdi" + counter).val();
        var MYili = $("#MYili" + counter).val();

        if (OkulTuru, OkulAdi, MYili == null) {
            counter -= 1
            continue
        }

        var Okul = {};

        Okul["OkulTuru"] = OkulTuru
        Okul["OkulAdi"] = OkulAdi
        Okul["MYili"] = MYili

        OkulKayitlari.push(Okul);
        counter -= 1
    }    

    $.ajax({
        type: "Post",
        url: "/Form/KayitPost/",
        dataType: "json",
        data: {
            formlistesi: Kayit,
            okullistesi: OkulKayitlari,
        },
        async: false,
        success: function () {
        },
    })
    window.location.href = "/Form/KayitFormu"
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
        success: function (Id) {
            MediaID = Id;
        },        
    });
    
};