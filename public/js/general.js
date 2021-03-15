/* FUNCTIONS */
/**
 * @description "check if value is null"
 * @param {String} element 
 * @return {Boolean} 
 */
function isNull(element) {
    return (element.replace(/ /g, "")) ? false : true;
}

/**
 * @description "get parameter value from url"
 * @param {String} param 
 */
function getUrlParameter(param) {
    let searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(param);
}

/**
 * @description "format date in a new"
 * @param {String} value "value of a date, time or both"
 * @param {String} valFormat "format of '@param value' (ex. MM:DD:YYYY)"
 * @param {String} newFormat "new format for '@param value' (ex. DD:MM:YY)"
 * @return {String}
 */
function momentFormat(value, valFormat, newFormat) {
    return moment(value, valFormat).format(newFormat);
}

/**
 * @description "return actual day and time"
 * @return {String}
 */
function now() {
    return moment().format("DD/MM/YYYY HH:mm:ss");
}

/* GENERATE MESSAGES */
let cont = 1;

/**
 * @description "generate messages with different types"
 * @param {String} type ("success", "error", "warning", "info")
 * @param {String} text 
 * @param {String} parentName (XPath route for JQuery)
 * @param {Number} seconds 
 */
function generateMessages(type, text, parentName, seconds) {
    const icons = {
        success: "far fa-check-circle",
        error: "far fa-times-circle",
        warning: "fas fa-exclamation-triangle",
        info: "fas fa-info-circle"
    }
    $(parentName).prepend(`<div id="${cont}" class="message msg-${type}"><i class="${icons[type]}"></i> ${text}</div>`);
    setTimeout(() => {
        $(parentName + " .message:nth-child(1)").fadeIn();
        countdown(parentName, cont, seconds);
        cont++;
    }, 1);
}

/**
 * @description "countdown for remove the message"
 * @param {String} parentName (XPath route for JQuery)
 * @param {Number} id "auto generate ID"
 * @param {Number} seconds 
 */
function countdown(parentName, id, seconds) {
    setTimeout(() => {
        $(parentName + " .message#" + id).fadeOut(400, () => $(parentName + " .message").last().remove());
    }, seconds * 1000);
}

/* LOGS */
/**
 * @description "load all the data of the logs end point in the tbody HTML"
 */
function loadLogsPage() {
    $.ajax({
        url: $("meta[name='url']").attr("content"),
        method: 'GET',
        headers: {
            token: $("meta[name='_token']").attr("content"),
        },
        success: (res) => {
            $("tbody").css("display", "none").html('');
            if (res.length > 0) {
                console.table(res);
                for (const item of res) {
                    var msg = "";
                    try {
                        msg = JSON.parse(item.message).message;
                    } catch (e) {
                        msg = item.message;
                    }
                    var output_badge = (item.level == 200) ? output_badge = "<span class=\"text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-blue-600 bg-blue-200 uppercase last:mr-0 mr-1\">Info</span>" : output_badge = item.level;

                    $("tbody").append(insertNewRow(
                        item.id, item.name, output_badge, msg,
                        momentFormat(item.updated_at, "YYYY-DD-MM hh:mm:ss", "DD/MM/YYYY HH:mm:ss"),
                        "logs"
                    ));
                }
            } else {
                $("tbody").append(
                    `<tr>
                        <td colspan="5"><p>Sense Logs.</p></td>
                    </tr>`
                );
            }

            $('tbody').fadeIn(300);
            $("body").addClass("body-logs");
        }
    });
}

/* STUDENTS */
/**
 * @description "load all the data of the students end point in the tbody HTML"
 * @param {String} url "URL of endpoint"
 */
function loadStudentsPage(url = $("meta[name='url']").attr("content")) {
    $.ajax({
        url: url,
        method: 'GET',
        headers: {
            token: $("meta[name='_token']").attr("content"),
        },
        success: (res) => {
            console.log(res);
            $("tbody").css("display", "none").html('');
            if (res.data.length > 0) {
                for (const item of res.data) {
                    $("tbody").append(insertNewRow(
                        item.id, item.name, item.email,
                        momentFormat(item.created_at, "YYYY-DD-MM hh:mm:ss", "DD/MM/YYYY HH:mm:ss"),
                        momentFormat(item.updated_at, "YYYY-DD-MM hh:mm:ss", "DD/MM/YYYY HH:mm:ss"),
                        "students"
                    ));
                }
                for (const item of res.links) {
                    console.log(item.label);
                    if (item.label === "&laquo; Previous") item.label = '<i class="fas fa-angle-left"></i>';
                    else if (item.label === "Next &raquo;") item.label = '<i class="fas fa-angle-right"></i>';

                    if (item.active)
                        $("ul.pagination").append(`<li class="pageNumber active no-click"><a>${item.label}</a></li>`);
                    else if (!item.url)
                        $("ul.pagination").append(`<li class="pageNumber no-click"><a>${item.label}</a></li>`);
                    else
                        $("ul.pagination").append(`<li class="pageNumber"><a href="${location.pathname}?page=${item.url.split("?page=")[1]}">${item.label}</a></li>`);
                }
            } else {
                $("tbody").append(
                    `<tr>
                        <td colspan="5"><p>Sense Alumnes.</p></td>
                    </tr>`
                );
            }

            $('tbody').fadeIn(300);
            $("body").addClass("body-logs");
        },
        error: (res) => {
            console.log(res);
        }
    });
}

/* TERMS */
const dataPickerOptions = {
    closeText: 'Cerrar',
    prevText: '<Ant',
    nextText: 'Sig>',
    currentText: 'Hoy',
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
    dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
    weekHeader: 'Sm',
    dateFormat: 'dd/mm/yy',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
}

/**
 * @description "load all the data of the terms end point in the tbody HTML"
 */
function loadTermPage() {
    $.ajax({
        url: $("meta[name='url']").attr("content"),
        method: 'GET',
        headers: {
            token: $("meta[name='_token']").attr("content"),
        },
        success: (res) => {
            $("tbody").css("display", "none").html('');
            if (res.length > 0) {
                for (const item of res) {
                    $("tbody").append(insertNewRow(
                        item.id, item.name, item.description,
                        momentFormat(item.start, "YYYY-MM-DD", "DD-MM-YYYY"),
                        momentFormat(item.end, "YYYY-MM-DD", "DD-MM-YYYY"),
                        momentFormat(item.created_at, "", "DD/MM/YYYY HH:mm:ss"),
                        momentFormat(item.updated_at, "", "DD/MM/YYYY HH:mm:ss"),
                        "terms"
                    ));
                }
            } else {
                $("tbody").append(
                    `<tr>
                        <td colspan="9"><p>No s'ha trobat cap curs.</p></td>
                    </tr>`
                );
            }
            $("tbody").append(
                `<tr>
                    <td colspan="9"><button type="button" id="new" class="btn secondary-btn"><i class="far fa-calendar-plus"></i> Afegeix un nou curs</button></td>
                </tr>`
            ).fadeIn(300);

            $("body").addClass("body-term");
            $("#new, #edit").on("click", (e) => rowEventEditAndNew(e.target));
        }
    });
}

/**
 * @description "load all the data of the career end point in the tbody HTML"
 */
function loadCareerPage() {
    $.ajax({
        url: $("meta[name='url']").attr("content"),
        method: 'GET',
        headers: {
            token: $("meta[name='_token']").attr("content"),
        },
        success: (res) => {
            $("tbody").css("display", "none").html('');
            if (res.length > 0) {
                for (const item of res) {
                    $("tbody").append(insertNewRow(
                        item.id, item.code, item.name, item.description, item.hours,
                        momentFormat(item.start, "YYYY-MM-DD", "DD-MM-YYYY"),
                        momentFormat(item.end, "YYYY-MM-DD", "DD-MM-YYYY"),
                        "careers"
                    ));
                }
            } else {
                $("tbody").append(
                    `<tr>
                        <td colspan="9"><p>No s'ha trobat cap curs.</p></td>
                    </tr>`
                );
            }
            $("tbody").append(
                `<tr>
                    <td colspan="9"><button type="button" id="new" class="btn secondary-btn"><i class="far fa-calendar-plus"></i> Afegeix un nou curs</button></td>
                </tr>`
            ).fadeIn(300);

            $("body").addClass("body-term");
            $("#new, #edit").on("click", (e) => rowEventEditAndNew(e.target));
        }
    });
}

function loadLogsPage() {
    $.ajax({
        url: $("meta[name='url']").attr("content"),
        method: 'GET',
        headers: {
            token: $("meta[name='_token']").attr("content"),
        },
        success: (res) => {
            //console.log(res);
            for (const item of res) {
                console.log(item);
                var tmp = JSON.parse(item.message);
                var output_badge = "";
                if (item.level == 200) {
                    output_badge = "<span class=\"text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-blue-600 bg-blue-200 uppercase last:mr-0 mr-1\">Info</span>";
                }
                $("tbody").append(insertNewRow(
                    item.id, item.name, output_badge, tmp.message,

                    momentFormat(item.updated_at, "YYYY-DD-MM hh:mm:ss", "DD/MM/YYYY HH:mm:ss"),
                    "logs"
                ));
            }
            $('tbody').fadeIn(300);
            $("body").addClass("body-logs");
        }
    });
}

function getCsvRowsCareer() {
    $("#remove").html('').addClass("loading");
    var fr = new FileReader();
    fr.onload = function () {
        var file = fr.result;

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        var import_file = "csv";
        $.ajax({
            url: $("meta[name='url']").attr("content"),
            method: 'POST',
            headers: {
                token: $("meta[name='_token']").attr("content"),
            },
            data: {
                import_file,
                file
            },
            success: (res) => {
                $("#form-file").trigger("reset");
                localStorage.setItem('careers_json', res);
                location.href = "/admin/dashboard/careers/import";
            },
            error: (res) => {
                $("#form-file").trigger("reset");
                console.log(res);
            }
        });
    }

    fr.readAsDataURL($('#file-csv')[0].files[0]);
}

/**
 * @description "callback function event for create or edit term"
 * @param {Element} tag "Event onClick: DOM Element tag pressed"
 */

function rowEventEditAndNew(tag) {
    $("body").css("overflow", "hidden");
    $(".bg-dialog").addClass("bg-opacity");
    const rowSelected = $(tag).closest("tr");
    let dialog = $(".modal-term").dialog({
        modal: true,
        buttons: {
            "Desa": () => {
                if (validationTermForm()) {
                    dialog.dialog("close");
                    updateTableRowTerm(rowSelected.children());
                    $("body").css("overflow", "auto");
                    setTimeout(() => $(".bg-dialog").removeClass("bg-opacity"), 700);
                }
            },
            "Cancela": () => {
                dialog.dialog("close");
                $("body").css("overflow", "auto");
                setTimeout(() => $(".bg-dialog").removeClass("bg-opacity"), 700);
            }
        },
        close: () => {
            $("body").css("overflow", "auto");
            $(".bg-dialog").removeClass("bg-opacity");
        },
        show: {
            effect: "fold",
            duration: 700
        },
        hide: {
            effect: "fold",
            duration: 700
        }
    });
    let childrens = $(".ui-dialog-buttonset").addClass("buttons-group").children();
    $(childrens[1]).attr("class", "btn cancel");
    $(childrens[0]).attr("class", "btn save").text((tag.id === "new") ? 'Crea' : 'Desa').after('<div class="or"></div>');
    $(".ui-dialog-title").text((tag.id === "new") ? 'Nou Curs' : 'Modicació de curs');
    $(".ui-dialog-titlebar-close").html('<i class="fas fa-times-circle"></i>');

    if (location.pathname.includes("admin/dashboard/terms")) {
        getInfoForModal(rowSelected.children(), "terms");
    } else if (location.pathname.includes("admin/dashboard/careers")) {
        getInfoForModal(rowSelected.children(), "careers");
    }

}

function getInfoForModal(cols, page) {
    if (page === "terms") {
        $(".label-group input#name").val($(cols[1]).text()); // NAME
        $(".label-group input#description").val($(cols[2]).text()); // DESCRIPTION
        $(".label-group input#start").val($(cols[3]).text()); // START
        $(".label-group input#end").val($(cols[4]).text()); // END
    }
}

/**
 * @description "insert new row in the table body"
 * @param  {...any} params "num n of parameters (last parameter define the actual page 'terms|logs|students|import')"
 * @return {String}
 */
function insertNewRow(...params) {
    let row = "<tr>";
    for (let i = 0; i < params.length - 1; i++)
        row += `<td>${(params[i]) ? params[i] : ''}</td>`;

    if (params[params.length - 1] == "terms") {
        row += `<td><button id="edit" class="btn save" title="Modificar el curs"><i class="fas fa-pen"></i></button></td>
                <td><a href="/admin/dashboard/terms/delete/${params[0]}" class="btn cancel" title="Eliminar el curs"><i class="fas fa-trash"></i></a></td>`;
    }
    return row + "</tr>";
}

/**
 * @description "insert new row in the terms table of the DB with AJAX"
 * @param {String} name 
 * @param {String} desc 
 * @param {String} start 
 * @param {String} end 
 * @param {String} created 
 * @param {String} updated 
 */
function insertTermInDB(name, desc, start, end, created, updated) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: $("meta[name='url']").attr("content"),
        method: 'POST',
        headers: {
            token: $("meta[name='_token']").attr("content"),
        },
        data: {
            name,
            desc,
            start,
            end,
            created,
            updated
        },
        success: (res) => {
            generateMessages("success", res.status, ".container-messages", 3);
            loadTermPage();
        },
        error: (res) => {
            console.log(res.responseJSON.message);
            generateMessages("error", "Error al servidor", ".container-messages", 3)
        }
    });
}

/**
 * @description "update row in the terms table of the DB with AJAX"
 * @param {Number} id 
 * @param {String} name 
 * @param {String} desc 
 * @param {String} start 
 * @param {String} end 
 * @param {String} updated 
 * @param {String} type "detect if is soft delete or not (default='softDelete')"
 */
function updateTermInDB(id, name, desc, start, end, updated, type = "softDelete") {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: $("meta[name='url']").attr("content") + "/" + id,
        method: 'PUT',
        headers: {
            token: $("meta[name='_token']").attr("content"),
        },
        data: {
            type,
            name,
            desc,
            start,
            end,
            updated
        },
        success: (res) => {
            generateMessages("success", res.status, ".container-messages", 3)
            if (type === "softDelete") {
                setTimeout(() => {
                    $("#remove").html('Eliminar').removeClass("loading");
                    location.href = "/admin/dashboard/terms"
                }, 2000);
            } else loadTermPage();
        },
        error: (res) => {
            console.log(res.responseJSON.message);
            generateMessages("error", "Error al servidor", ".container-messages", 3)
        }
    });
}

/**
 * @description "update tbody of HTML tables"
 * @param {Element[]} cols 
 */
function updateTableRowTerm(cols) {
    $("tbody").html('');
    if (cols.length === 1) {
        insertTermInDB(
            $(".label-group input#name").val(),
            $(".label-group input#description").val(),
            momentFormat($(".label-group input#start").val(), "DD/MM/YYYY", "YYYY-MM-DD"),
            momentFormat($(".label-group input#end").val(), "DD/MM/YYYY", "YYYY-MM-DD"),
            now(), now()
        );
    } else {
        updateTermInDB(
            $(cols[0]).text(),
            $(".label-group input#name").val(),
            $(".label-group input#description").val(),
            momentFormat($(".label-group input#start").val(), "DD/MM/YYYY", "YYYY-MM-DD"),
            momentFormat($(".label-group input#end").val(), "DD/MM/YYYY", "YYYY-MM-DD"),
            now(), null
        );
    }
}

/**
 * @description "validate if edit or new term form have an errors"
 * @return {Boolean}
 */
function validationTermForm() {
    let msg = "";
    if (isNull($(".label-group input#name").val())) msg += "El camp 'Nom' no pot estar buit.\n";
    if (isNull($(".label-group input#description").val())) msg += "El camp 'Descripció' no pot estar buit.\n";
    if (isNull($(".label-group input#start").val())) msg += "El camp 'Data d'inici' no pot estar buit.\n";
    if (isNull($(".label-group input#end").val())) msg += "El camp 'Data de finalització' no pot estar buit.\n";

    if (!msg) {
        let start = momentFormat($(".label-group input#start").val(), "DD-MM-YYYY", "YYYYMMDD");
        let end = momentFormat($(".label-group input#end").val(), "DD-MM-YYYY", "YYYYMMDD");
        if (start === "Invalid date")
            msg += "Data d'inici invàlida 'DD-MM-AAAA'.\n";
        else if (end === "Invalid date")
            msg += "Data de finalització invàlida 'DD-MM-AAAA'.\n";
        else if (end < start)
            msg += "La data de finalització no pot ser mes petita que la d'inici.\n";
    }

    if (msg) {
        generateMessages("error", msg, ".container-messages", 5);
        return false;
    } else return true;
}

/**
 * @description "JQuery DOM Ready: detect what is the current page of the user to load the functions"
 */
$(function () {
    if (location.pathname.endsWith("dashboard/terms/") || location.pathname.endsWith("dashboard/terms")) {
        $("tbody").fadeIn(300);
        loadTermPage();
        $("#start, #end").datepicker(dataPickerOptions);
        $("#start, #end").on("focus", () => {
            $(".ui-icon-circle-triangle-w").parent().html('<i class="fas fa-arrow-circle-left"></i>')
            $(".ui-icon-circle-triangle-e").parent().html('<i class="fas fa-arrow-circle-right"></i>')
        })
    } else if (location.pathname.includes("admin/dashboard/logs")) {
        loadLogsPage();
    } else if (location.pathname.includes("dashboard/terms/delete/")) {
        $("#name").focus();
        const name = $("span.code").text();
        $("#name").on("input", (e) => {
            if (e.target.value === name) $("#remove").removeClass("disabled");
            else $("#remove").addClass("disabled");
        });
        $("#remove").on("click", (e) => {
            if ($("#remove").hasClass("disabled")) {
                generateMessages("info", "Introdueix el nom del curs.", ".container-messages", 2.5)
                $("#name").focus();
            } else {
                if ($("#name").val() === name) {
                    $("#remove").html('').addClass("loading");
                    updateTermInDB(
                        $(".delete-term").attr("data-id"),
                        $(".delete-term").attr("data-name"),
                        $(".delete-term").attr("data-desc"),
                        $(".delete-term").attr("data-start"),
                        $(".delete-term").attr("data-end"),
                        $(".delete-term").attr("data-updated"),
                    );
                } else $("#remove").addClass("disabled");
            }
        })
    } else if (location.pathname.includes("admin/dashboard/logs")) {
        $("tbody").fadeIn(300);
        loadLogsPage();
    } else if (location.pathname.endsWith("/admin/dashboard/students/") || location.pathname.endsWith("/admin/dashboard/students")) {
        $("tbody").fadeIn(300);
        const page = getUrlParameter("page");
        if (page)
            loadStudentsPage($("meta[name='url']").attr("content") + `?page=${page}`);
        else
            loadStudentsPage();
        $("#file-csv").on("change", (e) => {
            if (e.target.files[0].type === "text/csv")
                $("#form-file").submit();
            else
                generateMessages("error", "Els arxius han de ser .CSV", ".container-messages", 2.5)
        })
        $("#form-file").submit((e) => {
            // e.preventDefault();
            // importCareer();
            // var formData = new FormData(document.getElementById("form-file"));
            //     $.ajaxSetup({
            //         headers: {
            //             'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            //         }
            //     });
            //     $.ajax({
            //         url: "/api/import",
            //         method: 'POST',
            //         headers: {
            //             token: $("meta[name='_token']").attr("content"),
            //         },
            //         data: formData,
            //         contentType: false,
            //         processData: false,
            //         success: (data) => {
            //             // $("#form-file").reset();
            //             // alert('File has been uploaded successfully');
            //             console.log(data);
            //         },
            //         error: function (data) {
            //             console.log(data);
            //         }
            //     });
        })
    } else if (location.pathname.endsWith("/admin/dashboard/careers/") || location.pathname.endsWith("/admin/dashboard/careers")) {
        loadCareerPage();
        $("#start, #end").datepicker(dataPickerOptions);
        $("#start, #end").on("focus", () => {
            $(".ui-icon-circle-triangle-w").parent().html('<i class="fas fa-arrow-circle-left"></i>')
            $(".ui-icon-circle-triangle-e").parent().html('<i class="fas fa-arrow-circle-right"></i>')
        });
        $("#file-csv").on("change", (e) => {
            console.log(e.target.files[0].name.split('.').pop());
            if (e.target.files[0].name.split('.').pop() === "csv") {
                getCsvRowsCareer();
            } else {
                generateMessages("error", "Els arxius han de ser .CSV", ".container-messages", 2.5)
                $(e.target).trigger("reset");
            }
        })
    } else if (location.pathname.endsWith("/admin/dashboard/careers/import") || location.pathname.endsWith("/admin/dashboard/careers/import/")) {
        const careers = JSON.parse(localStorage.getItem("careers_json"));
        if (!careers) {
            generateMessages("warning", "No s'ha trobat cap importació.", ".container-messages", 2.5);
            setTimeout(() => location.href = "/admin/dashboard/careers", 2500);
        } else {
            let arrayCareers = [];
            let cont = 0;
            let rows = "";
            for (const key in careers) {
                if (Object.hasOwnProperty.call(careers, key)) {
                    arrayCareers.push(careers[key]);
                    let dataRow = `
                    <div class="container-cb">
                        <input name="check-${cont}" id="check-${cont}" type="checkbox">
                        <label for="check-${cont}">
                            <i class="fa fa-check"></i>
                        </label>
                    </div>
                    <label class="text" for="check-${cont}">${key} - ${careers[key]['NOM_CICLE_FORMATIU']}</label>
                    <div class="row-bg"></div>`;
                    rows += insertNewRow(dataRow, "import");
                    cont++;
                }
            }
            $("tbody").css("display", "none").html(rows).fadeIn(300);
            $("label").click(function () {
                let rowBackground = $(this).closest('td').children(".row-bg");
                let input = $(this).closest('td').children(".container-cb").children("input");
                if (input.is(':checked')) {
                    rowBackground.animate({
                        width: "0vw"
                    });
                } else {
                    rowBackground.animate({
                        width: "100vw"
                    });
                }
            });
            $(".btn-start-import button").on("click", () => {
                const checkboxes = $("input[type='checkbox']:checked");
                let selectedRows = [];
                if (checkboxes.length > 0) {
                    generateMessages("info", "La importació ha començat.", ".container-messages", 2.5);
                    $(".btn-start-import button").html('').addClass("loading no-click");
                    for (const item of checkboxes) {
                        const index = $(item).prop("name").split("-")[1];
                        selectedRows.push(arrayCareers[index]);
                    }
                    console.table(selectedRows);
                    // AJAX
                    //.success {}
                    localStorage.removeItem("careers_json");
                    // location.href = "/admin/dashboard/careers";

                } else generateMessages("error", "No s'ha seleccionat cap cicle.", ".container-messages", 2.5);
            });
            generateMessages("success", "Arxiu carregat correctament.", ".container-messages", 2.5);
        }
    }
    
    //"DARK-MODE"
    $('.dark-mode').on('change',()=>{
        $('body').toggleClass('night');
        $('.dark-mode').toggleClass('night');

        if($('body').hasClass('night')){ //cuando el cuerpo tiene la clase 'dark' actualmente
            localStorage.setItem('darkMode', 'enabled'); //almacenar estos datos si el modo oscuro está activado
        }else{
            localStorage.setItem('darkMode', 'disabled'); //almacenar estos datos si el modo oscuro está desactivado
        }
    });
    if(localStorage.getItem('darkMode') == 'enabled'){
        $('body').toggleClass('night');
        $('.dark-mode').toggleClass('night');
    }
});
