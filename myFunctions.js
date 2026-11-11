$(document).ready(function() {
    // Showing or hiding details when the details checkbox is checked.
    $('table').on('change', 'input.toggle-details', function() {
        // Get the status
        var $tableRow = $(this).closest('tr');
        var $isChecked = $(this).is(':checked');
        
        // Show or hide the details element, depending on the checkbox state
        var $displayState = "none";
        if ($isChecked)
            $displayState = "block";
        $tableRow.next('tr.details-row').css("display", $displayState);
    })

    // Showing the reservation form if the button is clicked
    $('#btnContinue').click(function() {
        $('#bookingFormContainer').show()
    })
})

function getDate(dateStr) {
    // Date format must be yyyy-mm-dd and consist of a valid date
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateStr.match(dateFormatRegex))
        return null;
    const dateObj = new Date(dateStr);
    return dateObj;
}

function validateAndCalculate(event) {
    // Get all input DOMs
    var fullNameDom = document.getElementById('fullName');
    var nationalIdDom = document.getElementById('nationalId');
    var startDateDom = document.getElementById('startDate');
    var endDateDom = document.getElementById('endDate');
    var mobileDom = document.getElementById('mobile');
    var emailDom = document.getElementById('email');

    // Get all checked cars
    var carCheckBoxes = document.getElementsByName('selectedCar');
    var noCarsSelected = true;
    for (c = 0; c < carCheckBoxes.length; c++) {
        if (carCheckBoxes[c].checked) {
            noCarsSelected = false;
            break;
        }
    }
    if (noCarsSelected) {
        alert('يجب اختيار سيارة واحدة على الأقل');
        return;
    }

    // Verify that national ID, start date, and end date are not empty
    var nationalId = nationalIdDom.value;
    var startDate = startDateDom.value;
    var endDate = endDateDom.value;
    if (!nationalId) {
        alert('يجب إدخال الرقم الوطني');
        return;
    }
    if (!startDate) {
        alert('يجب إدخال تاريخ بداية التأجير');
        return;
    }
    if (!endDate) {
        alert('يجب إدخال تاريخ نهاية التأجير');
        return;
    }

    // Verify that the name was written in Arabic
    var fullName = fullNameDom.value;
    if (fullName) {
        const arabicRegex = /^\p{Script=Arabic}+$/u;
        if (!arabicRegex.test(fullName)) {
            alert('يجب إدخال الاسم الكامل باللغة العربية حصراً');
            return;
        }
    }

    // Verify that the national ID is valid
    if (nationalId.length != 11) {
        alert('الرقم الوطني يجب أن يتكون من 11 خانة');
        return;
    }
    if (nationalId.trim() !== '' && !Number.isNaN(Number(nationalId))) {
        // Check the first two digits (01-14)
        var region = String(nationalId[0]) + String(nationalId[1]);
        var regionNum = Number(region);
        if (regionNum < 1 || regionNum > 14) {
            alert('رقم المحافظة غير صالح');
            return;
        }
    } else {
        alert('الرقم الوطني يجب أن يتكون من أرقام يتكون من 11 خانة');
        return;
    }

    // Verify that the dates are valid
    var startDateObj = getDate(startDate);
    var endDateObj = getDate(endDate);
    if (startDateObj == null) {
        alert('تاريخ البدء غير صالح');
        return;
    }
    if (endDateObj == null) {
        alert('تاريخ النهاية غير صالح');
        return;
    }
    if (endDateObj <= startDateObj) {
        alert('تاريخ النهاية يجب أن يكون لاحقاً لتاريخ البداية');
        return;
    }

    // Verify that the phone number is valid
    var phone = mobileDom.value;
    if (phone) {
        if (phone.length != 10) {
            alert('الرقم الهاتفي يجب أن يتكون من أرقام يتكون من 10 خانة يبدأ بـ09');
            return;
        } else if (phone.trim() !== '' && !Number.isNaN(Number(phone))) {
            if (!phone.startsWith('09')) {
                alert('الرقم الهاتفي يجب أن يبدأ بـ09');
                return;
            }
        } else {
            alert('الرقم الهاتفي يجب أن يتكون من أرقام');
            return;
        }
    }

    // Verify that the e-mail address is valid
    var emailAddress = emailDom.value;
    if (emailAddress) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailAddress)) {
            alert('عنوان البريد الإلكتروني غير صالح');
            return;
        }
    }

    // Now, get info about the selected cars, and apply 10% discount if rental days exceed 7 days
    var prices = [250000, 400000, 300000, 180000, 220000];
    var rentalDiff = Math.abs(endDateObj - startDateObj);
    var msInDay = 1000 * 60 * 60 * 24;
    var rentalDays = Math.round(rentalDiff / msInDay);
    var totalPrice = 0;
    for (c = 0; c < carCheckBoxes.length; c++) {
        if (carCheckBoxes[c].checked) {
            totalPrice += prices[c];
        }
    }
    if (rentalDays > 7)
        totalPrice = totalPrice * (1 - 10 / 100);
    var carsListTable = document.getElementById('carsTable').querySelectorAll('tbody tr');
    var infoStrings = [];
    carsListTable.forEach((tr) => {
        var tds = tr.querySelectorAll('td');
        if (tds.length != 6)
            return;
        var carId = tds[0].textContent;
        var carName = tds[1].textContent;
        var carYear = tds[2].textContent;
        var carPrice = tds[3].textContent;
        infoStrings.push("[" + carId + "] " + carName + " (" + carYear + ") | " + carPrice);
    });
    alert("السيارات المختارة:\n\n" + infoStrings.join("\n") + "\n\nأيام التأجير: " + rentalDays + " يوم\nالسعر الإجمالي: " + totalPrice);
}