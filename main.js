
$(document).ready(function () {
    $.get("https://demo6370041.mockable.io/getcourses", function (data, status) {
        if (status === "success") {
            $('#trLoading').remove();
            let courses = data.data;
            let tbody = $('#tbody');
            courses.map((course, index) => {
                tbody.append(
                    `<tr id="${index + 1}">
                        <th>${course.id}</th> 
                        <th>${course.name}</th>
                    </tr>`
                )
            });
        }
        paginationCoursesTable();
        loadDataDescription();
    });

});

function loadDataDescription() {
    let totalRows = $("#tbody tr").length;
    let objDataCourse = [];
    for (let index = 1; index <= totalRows; index++) {
        $.get("https://demo6370041.mockable.io/course/" + index, function (dataCourse, status) {
            if (status === "success") {
                objDataCourse.push({
                    key: index,
                    value: dataCourse
                });
            }
        });
    }
    handleClickRows(objDataCourse, totalRows);
}

function findIndexData(objDataCourse, totalRows, id) {
    for (let index = 0; index < totalRows; index++) {
        if (objDataCourse[index].key === parseInt(id)) {
            return index;
        }
    }
}


function handleClickRows(objDataCourse, totalRows) {
    $("#table #tbody").on("click", "tr", function () {
        let id = $(this).find('th:first').text();
        let indexDataCourse = findIndexData(objDataCourse, totalRows, id);
        if ($.isNumeric(id)) {
            if (($('#sub_' + id).length) == 0) {
                let tmp = $("<tr class= 'sub' id='sub_" + id + "'><th colspan='2'><p>Description: " + objDataCourse[indexDataCourse].value.description + "<br><br>Textbook: " + objDataCourse[indexDataCourse].value.textbook + "</p></th></tr>");
                tmp.insertAfter($("#" + id));
            }
            else {
                $('#sub_' + id).remove();
            }
        }
    });
}

function paginationCoursesTable() {
    let trNum = 0
    const MAX_ROWS = 4
    let totalRows = $("#tbody tr").length;
    // show page 1, 2, 3, 4
    $('#table tr:gt(0)').each(function () {
        trNum++;
        if (trNum > MAX_ROWS) $(this).hide();
        if (trNum <= MAX_ROWS) {
            $(this).show();
        }
    });

    showButtonAndHandleClick(MAX_ROWS, totalRows)
}


function showButtonAndHandleClick(MAX_ROWS, totalRows) {
    if (MAX_ROWS < 8 && MAX_ROWS > 0) {
        $(`#tbody tr:nth-child(${MAX_ROWS}n)`).css("border-bottom", "2px solid black");
        $(`#tbody tr:nth-child(${MAX_ROWS}n + ${1})`).css("border-top", "2px solid black");
        // message
        $("#pagination_message p").text("Showing " + 1 + " to " + MAX_ROWS + " of " + totalRows + " entries");
        // pagination
        $('.pagination2').append(`<li class="prev">\<span>prev</span>\</li>`).show();
        if (totalRows > MAX_ROWS) {
            let pageNum = Math.ceil(totalRows / MAX_ROWS);
            for (let index = 1; index <= pageNum;) {
                $('.pagination2').append(`<li data-page="${index}">\<span> ${index++}</span>\</li>`).show();
            }
        }

        $('.pagination2').append(`<li class="next">\<span>next</span>\</li>`).show();

        $('.pagination2 li:nth-child(2)').addClass('active');
        $('.pagination2 li:first-child').addClass('disabled');

        handleClick(MAX_ROWS, totalRows);
    }
}

function handleClick(MAX_ROWS, totalRows) {
    $('.pagination2 li').on('click', function () {
        let pageNum = $(this).attr('data-page');
        let trIndex = 0;
        let classPrevAndNext = $(this).attr('class');
        let lengthLi = $(".pagination2 li").length;
        let index = $('.pagination2 li').index($('.active'));    // 0 1 2 3
        $('.sub').remove();
        if (classPrevAndNext === 'prev' || classPrevAndNext === 'prev disabled') {
            if (index === 2) {
                $('.pagination2 li:first-child').addClass('disabled');
                $(`.pagination2 li:last-child`).removeClass('disabled');
            } else {
                $(`.pagination2 li:last-child`).removeClass('disabled');
            }
            pageNum = index - 1;
            if (parseInt(pageNum) < 1) {
                pageNum = 1
            } else {
                $(`.pagination2 li:nth-child(${index + 1})`).removeClass('active');
                $(`.pagination2 li:nth-child(${index})`).addClass('active');
            }
        }
        else if (classPrevAndNext === 'next' || classPrevAndNext === 'next disabled') {
            if (index === (lengthLi - 3)) {
                $(`.pagination2 li:last-child`).addClass('disabled');
                $('.pagination2 li:first-child').removeClass('disabled');
            } else {
                $('.pagination2 li:first-child').removeClass('disabled');
            }
            pageNum = index + 1;
            if (pageNum > lengthLi - 2) {
                pageNum = lengthLi - 2;
            } else {
                $(`.pagination2 li:nth-child(${index + 1})`).removeClass('active');
                $(`.pagination2 li:nth-child(${pageNum + 1})`).addClass('active');
            }
        } else {
            $('.pagination2 li').removeClass('active');
            $(this).addClass('active');

            if (parseInt(pageNum) === 1) {
                $('.pagination2 li:first-child').addClass('disabled');
                $(`.pagination2 li:last-child`).removeClass('disabled');
            }
            else {
                $('.pagination2 li:first-child').removeClass('disabled');
            }

            if (parseInt(pageNum) === lengthLi - 2) {
                $(`.pagination2 li:last-child`).addClass('disabled');
                $('.pagination2 li:first-child').removeClass('disabled');
            } else {
                $('.pagination2 li:last-child').removeClass('disabled');
            }
        }
        let arrayShow = []
        if (pageNum !== undefined) {
            $('#table tr:gt(0)').each(function () {
                trIndex++;
                if (trIndex > (MAX_ROWS * pageNum) || trIndex <= (MAX_ROWS * pageNum) - MAX_ROWS) {
                    $(this).hide();
                } else {
                    $(this).show();
                    arrayShow.push(trIndex);
                }
            });
        }
        $("#pagination_message p").text("Showing " + arrayShow[0] + " to " + arrayShow[arrayShow.length - 1] + " of " + totalRows + " entries");
    });
}