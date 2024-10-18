// $(document).ready(function () {
//   var current_fs, next_fs, previous_fs; // fieldsets
//   var opacity;
//   var current = 1;
//   var steps = $("fieldset").length;

//   setProgressBar(current);

//   $(".next").click(function () {
//       current_fs = $(this).parent();
//       next_fs = $(this).parent().next();

//       // Validate the current fieldset before moving to the next
//       if (validateForm(current_fs)) {
//           // Add Class Active
//           $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

//           // Show the next fieldset
//           next_fs.show();
//           // Hide the current fieldset with style
//           current_fs.animate(
//               { opacity: 0 },
//               {
//                   step: function (now) {
//                       // For making fieldset appear animation
//                       opacity = 1 - now;

//                       current_fs.css({
//                           display: "none",
//                           position: "relative",
//                       });
//                       next_fs.css({ opacity: opacity });
//                   },
//                   duration: 500,
//               }
//           );
//           setProgressBar(++current);
//       }
//   });

//   $(".previous").click(function () {
//       current_fs = $(this).parent();
//       previous_fs = $(this).parent().prev();

//       // Remove class active
//       $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

//       // Show the previous fieldset
//       previous_fs.show();

//       // Hide the current fieldset with style
//       current_fs.animate(
//           { opacity: 0 },
//           {
//               step: function (now) {
//                   // For making fieldset appear animation
//                   opacity = 1 - now;

//                   current_fs.css({
//                       display: "none",
//                       position: "relative",
//                   });
//                   previous_fs.css({ opacity: opacity });
//               },
//               duration: 500,
//           }
//       );
//       setProgressBar(--current);
//   });

//   function setProgressBar(curStep) {
//       var percent = parseFloat((100 / steps) * curStep);
//       percent = percent.toFixed();
//       $(".progress-bar").css("width", percent + "%");
//   }

//   function validateForm(current_fs) {
//       var isValid = true;
//       current_fs.find('input[required]').each(function () {
//           if (!$(this).val()) {
//               isValid = false;
//               alert('Please fill in all required fields.');
//               return false; // Exit the loop if any field is empty
//           }
//       });

//       if (!isValid) {
//           return false;
//       }

//       // Additional validation for specific fields
//       if (current === 1) { // Check if moving to the first step (Personal Information)
//           var contactValue = current_fs.find('input[name="contact"]').val();
//           if (isNaN(contactValue)) {
//               alert('Contact must be a number.');
//               return false;
//           }
//       }
//       if (current === 1) { 
//       var ageValue = current_fs.find('input[name="age"]').val();
//       if (isNaN(ageValue)) {
//           alert('Age must be a number.');
//           return false;
//       }
//     }
//       if (current === 2) { // Check if moving to the second step (Professional Information)
//           var experienceValue = current_fs.find('input[name="experience"]').val();
//           if (isNaN(experienceValue)) {
//               alert('Experience must be a number.');
//               return false;
//           }
//       }

//       return true;
//   }
// });



$(document).ready(function () {
    var current_fs, next_fs, previous_fs; // fieldsets
    var opacity;
    var current = 1;
    var steps = $("fieldset").length;

    setProgressBar(current);

    $(".next").click(function () {
        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        // Validate the current fieldset before moving to the next
        if (validateForm(current_fs)) {
            // Add Class Active
            $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

            // Show the next fieldset
            next_fs.show();
            // Hide the current fieldset with style
            current_fs.animate(
                { opacity: 0 },
                {
                    step: function (now) {
                        // For making fieldset appear animation
                        opacity = 1 - now;

                        current_fs.css({
                            display: "none",
                            position: "relative",
                        });
                        next_fs.css({ opacity: opacity });
                    },
                    duration: 500,
                }
            );
            setProgressBar(++current);
        }
    });

    $(".previous").click(function () {
        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        // Remove class active
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

        // Show the previous fieldset
        previous_fs.show();

        // Hide the current fieldset with style
        current_fs.animate(
            { opacity: 0 },
            {
                step: function (now) {
                    // For making fieldset appear animation
                    opacity = 1 - now;

                    current_fs.css({
                        display: "none",
                        position: "relative",
                    });
                    previous_fs.css({ opacity: opacity });
                },
                duration: 500,
            }
        );
        setProgressBar(--current);
    });

    function setProgressBar(curStep) {
        var percent = parseFloat((100 / steps) * curStep);
        percent = percent.toFixed();
        $(".progress-bar").css("width", percent + "%");
    }
    $("#msform").submit(function (e) {
        e.preventDefault(); // Prevent the default form submission
        console.log("Submited");
        //Serialize form data
        var formData = $(this).serializeArray();
        var formDataObject = {};
        $.each(formData, function (i, field) {
          formDataObject[field.name] = field.value;
        });
        console.log(formDataObject);
        // Send AJAX request to the server
        $.ajax({
          type: "POST",
          url: "http://localhost:7000/submit",
          data: formDataObject,
          contentType: "application/x-www-form-urlencoded",
          success: function (response) {
            console.log(response);
            // You can handle the success response here
            // Display an alert message or perform other actions
            alert("Data submitted successfully!");
          },
          error: function (error) {
            console.error("Error submitting form:", error);
            // Handle the error response here
            alert("Error submitting form. Please try again.");
          },
        });
      });

    function validateForm(current_fs) {
        var isValid = true;
        current_fs.find('input[required]').each(function () {
            if (!$(this).val()) {
                isValid = false;
                alert('Please fill in all required fields.');
                return false; // Exit the loop if any field is empty
            }
        });
        

        if (!isValid) {
            return false;
        }

        // Additional validation for specific fields
        if (current === 1) { // Check if moving to the first step (Personal Information)
            var contactValue = current_fs.find('input[name="contact"]').val();
            if (isNaN(contactValue)) {
                alert('Contact must be a number.');
                return false;
            }
            var contactValue = current_fs.find('input[name="contact"]').val();
            if (isNaN(contactValue) || contactValue.length !== 10) { // Check if contact is not a number or not 10 digits
                alert('Contact must be a 10-digit number.');
                return false;
            }
            var ageValue = current_fs.find('input[name="age"]').val();
            var age = parseInt(ageValue);

            if ( age < 1 || age > 99 || ageValue.charAt(0) === '0') {
                alert('Please enter correct age');
                return false;
            }
            var ageValue = current_fs.find('input[name="age"]').val();
            if (isNaN(ageValue)) {
                alert('Age must be a number.');
                return false;
            }
            if (!current_fs.find('input[name="gender"]:checked').length) {
                alert('Please select a gender.');
                return false;
            }
            var name =  current_fs.find('input[name="name"]').val();
            if(!/^[A-Za-z]+$/.test(name)){ // Check if name contains only characters
                alert("Name should contain only letters.");
                return false; // Prevent form submission
            }
        }

        if (current === 2) { // Check if moving to the second step (Professional Information)
            if (!current_fs.find('input[name="qualification"]:checked').length) {
                alert('Please select a qualification.');
                return false;
            }
            var experienceValue = current_fs.find('input[name="experience"]').val();
            if (isNaN(experienceValue)) {
                alert('Experience must be a number.');
                return false;
            }
            
            var experienceValue = parseInt(current_fs.find('input[name="experience"]').val());
            if (isNaN(experienceValue) || experienceValue < 1 || experienceValue > 35) {
                alert('Please enter correct experience');
                return false;
            }

            // Check if specialization is selected
            if (current_fs.find('#specialization').val() === '') {
                alert('Please select a specialization.');
                return false;
            }

            // Check if university is selected
            if (current_fs.find('#university').val() === '') {
                alert('Please select a university.');
                return false;
            }

            // Check if seniority is selected
            if (current_fs.find('#seniority').val() === '') {
                alert('Please select a seniority.');
                return false;
            }
            
        }
        if (current === 3) {
            if (!current_fs.find('input[name="area"]:checked').length) {
                alert('Please select a area.');
                return false;
            }
            
         }

        return true;
    }

    function formSubmit(){
        var form = document.getElementById("msform");
        console.log('Hello world');
        // Get all form elements
        var formData = new FormData(form);
        
        // Display form data
        for (var pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
        
        // Prevent default form submission
        return false;
    }
});
