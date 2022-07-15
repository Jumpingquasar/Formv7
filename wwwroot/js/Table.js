$(document).ready(function () {
    PersonelList();
    $('#PersonelTable').DataTable();
});

function PersonelList() {

    $.ajax({
        type: "Get",
        url: "/Form/PersonelList",
        dataType: "json",
        async: false,
        success: function (data) {
            personeldata = data
        }
    })
    $.ajax({
        type: "Get",
        url: "/Form/GetCografya",
        dataType: "json",
        async: false,
        success: function (result) {
            cografya = result
        }
    })
    $.ajax({
        type: "Get",
        url: "/Form/GetImages",
        dataType: "json",
        async: false,
        success: function (result) {
            images = result
        }
    })

    for (var i = 0; i < Object.keys(personeldata).length; i++) {
        for (var j = 0; j < cografya.length; j++) {
            if (personeldata[i]["dogumYeriUlke"] == cografya[j].id) {
                var countryname = cografya[j].tanim;
            };
            if (personeldata[i]["dogumYeriSehir"] == cografya[j].id) {
                var cityname = cografya[j].tanim;
            };
        };
        for (var k = 0; k < Object.keys(images).length; k++) {
            if (personeldata[i]["mediaID"] == images[k]["mediaID"]) {
                var selectimage = images[k]["mediaName"];
            };
        };
        if (personeldata[i]["aktif"] == false) {
            continue
        }

        var Pozisyonlar = [];
        for (var a in personeldata[i]["pozisyon"]) {
            if (a == 0) { Pozisyonlar.push("Vardiya şefi")}
            if (a == 1) { Pozisyonlar.push("Barista")}
            if (a == 2) { Pozisyonlar.push("Mutfak Elemanı")}
            if (a == 3) { Pozisyonlar.push("Aşçı")}
            if (a == 4) { Pozisyonlar.push("Temizlik Görevlisi")}
        }



        $("#PersonelTBody").append(
            `<tr>
                <td>` + personeldata[i]["isim"] + `</td>
                <td>` + personeldata[i]["soyisim"] + `</td>
                <td>` + personeldata[i]["email"] + `</td>
                <td>` + personeldata[i]["cinsiyet"] + `</td>
                <td>` + countryname + `</td>
                <td>` + cityname + `</td>
                <td>` + personeldata[i]["dogumgunu"] + `</td>
                <td>` + personeldata[i]["not"] + `</td>
                <td><img src="/Image/` + selectimage + `" border="3" height="100" width="100" /></td>
                <td>` + Pozisyonlar + `</td>
                <td><a class="btn btn-info" onclick="update(` + personeldata[i]["personelId"] + `)" id="update` + personeldata[i]["personelId"] + `">Güncelle</a> <a class="btn btn-warning" onclick="Sil(` + personeldata[i]["personelId"] + `)" id="sil` + i + `"> Sil</a></td>
            </tr>`
        )
    };
};

function update(i) {
    window.location.href = "/Form/Update?id=" + i;
};

function Sil(silid) {
    if (confirm("Bu girdiyi silmek istediğinize emin misiniz?")) {
        $.ajax({
            type: "Get",
            url: "/Form/KayitGet/" + silid,
            dataType: "json",
            data: { silid: silid },
            async: false,
            success: function (data)
            {
                $.ajax({
                    type: "Post",
                    url: "/Form/Delete/" + silid,
                    dataType: "json",
                    data: {data: data[0]},
                    async: false,
                    success: function () {},
                });

            }
        });
        window.location.href = "/Form/Table"        
    }
}