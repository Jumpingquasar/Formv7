$(document).ready(function () {
    counter = 0
    OkulBefore = []
    GetCountry()
    GetSchool()
    let url_str = (window.location).href;
    let url = new URL(url_str);
    let search_params = url.searchParams;
    let id = search_params.get('id');
    Get()
});

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


function Get() {

    id = getParameterByName("id");

    $.ajax({
        type: "Get",
        url: "/Form/KayitGet/" + id,
        dataType: "json",
        data: { id: id },
        async: false,
        success: function (data) {
            console.log(data)
            PersonelID = data[0]["personelId"];
            $("#Isim").val(data[0]["isim"]);
            $("#Soyisim").val(data[0]["soyisim"]);
            $("#email").val(data[0]["email"]);
            $("#Dogumgunu").val(data[0]["dogumgunu"]);

            if (data[0]["cinsiyet"] == "Erkek") {
                $('#cinsiyet1').attr('checked', 'checked');
            }

            else if (data[0]["cinsiyet"] == "Kadın") {
                $('#cinsiyet2').attr('checked', 'checked');
            }

            else if (data[0]["cinsiyet"] == "N/A") {
                $('#cinsiyet3').attr('checked', 'checked');
            }

            else {
                $('#cinsiyet4').attr('checked', 'checked');
                $("#cinsiyet4_text").val(data[0]["cinsiyet"])
            }


            $("#Country").val(data[0]["dogumYeriUlke"]);
            GetCity(data[0]["dogumYeriUlke"]);
            $("#City").val(data[0]["dogumYeriSehir"]);
            $("#Not").val(data[0]["not"])

            for (var val in data[0]["pozisyon"])
                if (val == 0) { $("#preselect0").attr("selected", "selected") }
                else if (val == 1) { $("#preselect1").attr("selected", "selected") }
                else if (val == 2) { $("#preselect2").attr("selected", "selected") }
                else if (val == 3) { $("#preselect3").attr("selected", "selected") }
                else if (val == 4) { $("#preselect4").attr("selected", "selected") }
            return MediaID = data[0]["mediaID"]

        }
    })

    $.ajax({
        type: "Get",
        url: "/Form/ImageGet/" + MediaID,
        dataType: "json",
        data: { MediaID: MediaID },
        async: false,
        success: function (ImageData) {
            $("#preview").attr("src", "/Image/" + ImageData[0]["mediaName"])
        }
    })

    $.ajax({
        type: "Get",
        url: "/Form/OkulGet/" + id,
        dataType: "json",
        data: { id: id },
        async: false,
        success: function (OkulData) {
            i = 0
            
            while (i < Object.keys(OkulData).length) {
                OkulBefore.push(OkulData[i]["id"]);
                $("#Okul" + i).val(OkulData[i]["okulTuru"])
                $("#OkulAdi" + i).val(OkulData[i]["okulAdi"])
                $("#MYili" + i).val(OkulData[i]["mYili"])
                i++
                if (i !== Object.keys(OkulData).length)
                {
                    Add(i - 1)
                }
            }
            IlkOkul = i
        }
    })


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
        data: { value: countryid },
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

$("#Country").on("change", function () {
    var selected_country = $("#Country").val();
    GetCity(selected_country);
});

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

function OkulSil(OkulSil) {
    $("#OkulRow" + OkulSil).remove()
    counter -= 1
};

function Add() {
    if (counter == 5) {
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
};

$("#Add").click(function () {
    Add();
});

$("#FormFileID").change(function () {
    const [file] = FormFileID.files
    if (file) {
        preview.src = URL.createObjectURL(file)
    }
    uploadFile();
});

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

function Update(PersonelID) {

    PersonelID = getParameterByName("id");

    var PersonelID = PersonelID;
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

    Kayit["PersonelId"] = PersonelID;
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

    counter = counter + IlkOkul
    a=0
    while (a < counter) {
        var id = OkulBefore[a];
        var OkulTuru = $("#Okul" + a + " option:selected").val();
        var OkulAdi = $("#OkulAdi" + a).val();
        var MYili = $("#MYili" + a).val();

        if (OkulTuru, OkulAdi, MYili == null) {
            a += 1
            continue
        }

        var Okul = {};

        if (id !== undefined) {
            Okul["id"] = id
        }
        Okul["OkulTuru"] = OkulTuru
        Okul["OkulAdi"] = OkulAdi
        Okul["MYili"] = MYili

        OkulKayitlari.push(Okul);
        a += 1
    }

    $.ajax({
        type: "Post",
        url: "/Form/UpdatePost/",
        dataType: "json",
        data: {
            formlistesi: Kayit,
            okullistesi: OkulKayitlari
        },
        async: false,
        success: function () {
        },
    })
    window.location.href = "/Form/Table"
};

$("#Submit").click(function () {
    Update(PersonelID);
});