const typedTextSpan = document.querySelector(".typed-text"),
    textArray = ["ONLINE", "ENJOY~"],
    typingDelay = 200,
    erasingDelay = 100,
    newTextDelay = 2e3;
let textArrayIndex = 0,
    charIndex = 0;

function type() { charIndex < textArray[textArrayIndex].length ? (typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex), charIndex++, setTimeout(type, 200)) : setTimeout(erase, 2e3) }

function erase() { charIndex > 0 ? (typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1), charIndex--, setTimeout(erase, 100)) : (textArrayIndex++, textArrayIndex >= textArray.length && (textArrayIndex = 0), setTimeout(type, 1300)) }
document.addEventListener("DOMContentLoaded", (function () { setTimeout(type, 2250) }));

// $(document).ready((function () {
//     $(".changeprofile").submit((function (e) {
//         var formObj, formURL = $(this).attr("action"),
//             formData = this;
//         const user = $('.form-control').val()
//         console.log(user)
//         $.ajax({
//             url: formURL, type: "POST", data: formData, contentType: !1, cache: !1, processData: !1, beforeSend:
//                 function () {
//                     $("button").attr("disabled", "disabled"),
//                         $("input").attr("disabled", "disabled"),
//                         $("a").attr("disabled", "disabled"),
//                         $(".inibutton").html('<i class="fas fa-spinner fa-spin"></i> Wait')
//                 },
//             success:
//                 function (data) {
//                     data.includes("Success") ?
//                         ($("button").removeAttr("disabled", "disabled"),
//                             $("a").removeAttr("disabled", "disabled"),
//                             $("input").removeAttr("disabled", "disabled"),
//                             $(".inibutton").html("Save"),
//                             $.notify(
//                                 { icon: "tim-icons icon-check-2", message: data },
//                                 {
//                                     type: "success", timer: 3e3, placement: { from: "top", align: "right" }
//                                 }), window.location = window.location)
//                         :
//                         (
//                             $("button").removeAttr("disabled", "disabled"),
//                             $("a").removeAttr("disabled", "disabled"),
//                             $("input").removeAttr("disabled", "disabled"),
//                             $(".inibutton").html("Save"),
//                             $.notify({ icon: "tim-icons icon-simple-remove", message: data },
//                                 { type: "danger", timer: 3e3, placement: { from: "top", align: "right" } })
//                         )
//                 }
//         }), e.preventDefault()
//     }))
// }))


function load() {
    $("button").attr("disabled", "disabled"),
        $("input").attr("disabled", "disabled"),
        $("a").attr("disabled", "disabled"),
        $(".inibutton").html('<i class="fas fa-spinner fa-spin"></i> Wait')
}
function save(success = true, message, data = {}) {
    if (success) {
        $("button").removeAttr("disabled", "disabled"),
            $("a").removeAttr("disabled", "disabled"),
            $("input").removeAttr("disabled", "disabled"),
            $(".inibutton").html("Save"),
            // $.notify(
            //     { icon: "tim-icons icon-check-2", message: message, data },
            //     {
            //         type: "success", timer: 3e3, placement: { from: "top", align: "right" }
            //     })
            Swal.fire(
                'Completed',
                message,
                'success'
            )
        if (data?.username) {
            $('#c-username').html(data.username)
            $('#c-tusername').html(data.username)
        }
        if (data?.email) {
            $('#c-email').html(data.email)
        }
        if (data?.apikey) {
            $('#c-apikey').html(data.apikey)
        }
        // window.location = window.location
    } else {
        $("button").removeAttr("disabled", "disabled"),
            $("a").removeAttr("disabled", "disabled"),
            $("input").removeAttr("disabled", "disabled"),
            $(".inibutton").html("Save"),
            Swal.fire({
                icon: 'error',
                title: 'Oops... :(',
                text: message,
                footer: message == 'Invalid Authentication' ? '<a href="/login">Goto login page..</a>' : ''
            }).then(() => {
                if (message == 'Invalid Authentication' || message == 'Invalid Recaptcha') {
                    window.location.href = window.location.origin + '/login'
                }
            })
    }
}


$.postJSON = function (url, data, callback) {
    return jQuery.ajax({
        'type': 'POST',
        'url': url,
        'contentType': 'application/json',
        'data': $.toJSON(data),
        'dataType': 'json',
        'success': callback
    });
};

$(".changeprofile").submit((function (e) {
    $.postJSON('/profile', {
    }, (data) => {
        console.log(data);
    })
}))



function changeToActive(id) {
    $('.cardlistjs').removeClass('active')
    $('#' + id).addClass('active')
    console.log(id);
    document.getElementsByClassName('cardlistjs').className.replace(/(?:^|\s)MyClass(?!\S)/g, '')
    document.getElementById(id)
    var element = document.getElementById(id);
    element.classList.add('active');
}

setTimeout(() => {
    var element = document.getElementById('name-act').textContent
    var card = document.getElementById(element.replace(/ /g, '_'));
    card.classList.add('active');
    console.log(element);
}, 10);


function verify(auth) {
    $.ajax({
        'type': 'POST',
        'url': '/verify',
        'contentType': 'application/json',
        'data': JSON.stringify({ auth }),
        // 'dataType': 'json',
        'success': async (data) => {
            // console.log(data);
            if (data.includes('OK')) {
                const Toast = Swal.mixin({
                  toast: true,
                  position: 'top-right',
                  iconColor: 'white',
                  customClass: {
                    popup: 'colored-toast'
                  },
                  showConfirmButton: false,
                  timer: 1500,
                  timerProgressBar: true
                })
                await Toast.fire({
                  icon: 'success',
                  title: 'Authenticated successfully'
                })
                // await Toast.fire({
                //   icon: 'error',
                //   title: 'Error'
                // })
                // await Toast.fire({
                //   icon: 'warning',
                //   title: 'Warning'
                // })
                // await Toast.fire({
                //   icon: 'info',
                //   title: 'Info'
                // })
                // await Toast.fire({
                //   icon: 'question',
                //   title: 'Question'
                // })
            } else {
                // console.log('Wrong')
                // $('html').html(data)
                Swal.fire(
                    'Woopss!',
                    data.replace('Error: ',''),
                    'error'
                ).then(() => {
                        window.location.href = window.location.origin + '/login'
                })
            }
        },
        'error': function (err) {
            console.log(err);
        }
    })
}

// var onloadCallback = () => {
//     window.grecaptcha = grecaptcha.render('google_recaptcha', {
//         sitekey : '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
//         callback: (data) => console.log(data)
//     });

// };


function editModal(phone, status, username, email, password, account_type, apikey, expired, auth, act, data) {
    // let flatpickrInstance
    Swal.fire({
        title: act == 'add' ? 'Add User' : 'Edit User',
        html: `
        <table>
            <tr>
                <td style="text-align: center; vertical-align: middle;"><label for="status">Status</label></td>
                <td>
                    <select id="status" name="status" class="swal2-input" style="width: 285px" placeholder="Status">
                        <option value="${status == 'true'}">Account Status (${status == 'true' ? 'Active' : 'Unactive'})</option>
                        <option value="true">Active</option>
                        <option value="false">Unactive</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td><label for="username">User</label></td>
                <td><input type="text" id="username" value="${username}" class="swal2-input" style="width: 285px" placeholder="Username"></td>
            </tr>
            <tr>
                <td><input type="hidden" id="oldusername" value="${data?.oldusername}" class="swal2-input" style="width: 285px" placeholder="Username"></td>
            </tr>
            <tr>
                <td><label for="pass">Pass</label></td>
                <td>
                    <input type="password" id="password" value="${password}" style="padding-right: 50px;width: 285px;" class="swal2-input" placeholder="Password">
                    <span class="fi fi-rr-eye-crossed" id="showPass" style="position: absolute; right: 90px; top: 265px">
                </td>
            </tr>
            <tr>
                <td><label for="apikey">Apikey</label></td> 
                <td>
                    <input type="text" id="apikey" value="${apikey}" style="width: 285px" class="swal2-input" placeholder="Apikey">
                </td>
            </tr>
            <tr>
                <td><label for="phone">Phone</label></td>
                <td>
                    <input type="text" id="phone" value="${phone}" style="width: 285px" class="swal2-input" placeholder="Phone">
                </td>
            </tr>
            <tr>
                <td><label for="email">Email</label></td>
                <td>
                    <input type="text" id="email" value="${email}" style="width: 285px" class="swal2-input" placeholder="Email">
                </td>
            </tr>
            <tr>
                <td><label for="username">Acc Type</label></td>
                <td>
                    <select id="account_type" name="account_type" style="width: 285px" class="swal2-input" style="width: 285px" placeholder="Account Type">
                        <option value="${account_type}">Account Type (${account_type})</option>
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td><label id="expired-label" style="display: ${account_type == 'free' ? 'none' : 'initial'}" for="expired">Expired On</label></td>
                <td>
                    ${account_type == 'free' ? `<input type="hidden" id="expired_on" value="null" class="swal2-input" style="width: 285px" name="expired_on">` : `<input type="date" id="expired_on" value="${moment(Number(expired)).format('YYYY-MM-DD')}" class="swal2-input" style="width: 285px" name="expired_on">`}
                </td>
            </tr>
        <table>`,
        denyButtonText: `Don't save`,
        confirmButtonText: 'Save',
        showCancelButton: true,
        focusConfirm: false,
        preConfirm: () => {
            const username = Swal.getPopup().querySelector('#username').value
            const password = Swal.getPopup().querySelector('#password').value
            const status = Swal.getPopup().querySelector('#status').value
            const apikey = Swal.getPopup().querySelector('#apikey').value
            const account_type = Swal.getPopup().querySelector('#account_type').value
            const email = Swal.getPopup().querySelector('#email').value
            const phone = Swal.getPopup().querySelector('#phone').value
            const expired_on = account_type == 'premium' ? moment(Swal.getPopup().querySelector('#expired_on').value).valueOf() : null
            // value="${moment(expired).format('YYYY-MM-DD')}" 
            if (!username || !password || !status || !apikey || !email || !phone || !account_type) {
                Swal.showValidationMessage(`Input all value in the box`)
            } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
                Swal.showValidationMessage(`Plese input a valid email`)
            }
            return { username, password, status, apikey, account_type, expired_on, email, phone, oldusername: data?.oldusername }
        },
        willOpen: () => {
            // flatpickrInstance = flatpickr(
            //     Swal.getPopup().querySelector('#expired_on')
            // )
        }
    }).then((result) => {
        // console.log(expired == 'null');
        if (result.isConfirmed) {
            // console.log(result.value)
            $.ajax({
                'type': 'POST',
                'url': '/action/' + act,
                'contentType': 'application/json',
                'data': JSON.stringify({ ...result.value, auth, password1: result.value.password, password2: result.value.password }),
                // 'dataType': 'json',
                'success': (data) => {
                    if (data.includes('OK')) {
                        Swal.fire(
                            act == 'add' ? 'Added' : 'Edited!',
                            act == 'add' ? 'This user has been add.' : 'This user has been edit.',
                            'success'
                        )
                        .then(() => {
                            window.location.href = window.location.origin + window.location.pathname + '?auth=' + auth
                        })
                    } else if (data.includes('Error:')) {
                        Swal.fire(
                            'Woopss!',
                            data.replace('Error: ',''),
                            'error'
                        )
                    } else {
                        Swal.fire(
                            'Woopss!',
                            'We cannot find this user.',
                            'error'
                        )
                    }
                }
            })
        }

        // Swal.fire(`
        //   Login: ${result.value.login}
        //   Password: ${result.value.password}
        // `.trim())
    })
}


function deleteConfirm(username, auth) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                'type': 'POST',
                'url': '/action/delete',
                'contentType': 'application/json',
                'data': JSON.stringify({ username, auth }),
                // 'dataType': 'json',
                'success': (data) => {
                    // console.log(data);
                    if (data.includes('OK')) {
                        Swal.fire(
                            'Deleted!',
                            'This user has been deleted.',
                            'success'
                        )
                        .then(() => {
                            window.location.href = window.location.origin + window.location.pathname + '?auth=' + auth
                        })
                    } else {
                        Swal.fire(
                            'Woopss!',
                            'We cannot find this user.',
                            'error'
                        )
                    }
                },
                'error': function (err) {
                    console.log(err);
                }
            })
            // console.log(ajaxReq.status);
        }
    })
}



// if (element != null) {
//     window.setInterval(function () {
//         var element = document.getElementById('logs');
//         element.scrollTo(0, element.scrollHeight)
//     }, 2000);
// }


function imgLoaded() {
    $('.swal2-title').html('Are you sure to save this picture?')
}

$(document).ready(() => {

    $('#forgot_button_submit').click((e) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const auth = urlParams.get('auth')
    const pass1 = $('#pass1').val() 
    const pass2 = $('#pass2').val() 
        $.ajax({
                    'type': 'GET',
                    'url': '/forgot-password/?auth=' + auth + `&pass1=${pass1}&pass2=${pass2}&action=submit`,
                    // 'contentType': 'application/json',
                    // 'data': JSON.stringify({ auth, pass1, pass2, action: '' }),
                    // 'dataType': 'json',
                    'success': async (data) => {
                        // console.log(data);
                        if (data.includes('OK')) {
                            const Toast = Swal.mixin({
                              toast: true,
                              position: 'top-right',
                              iconColor: 'white',
                              customClass: {
                                popup: 'colored-toast'
                              },
                              showConfirmButton: false,
                              timer: 1500,
                              timerProgressBar: true
                            })
                            await Toast.fire({
                              icon: 'success',
                              title: 'Authenticated successfully'
                            })                          
                            window.location.href = window.location.origin + '/dashboard' + '?auth=' + auth + '&forgot=success'
                        } else {
                            Swal.fire(
                                'Woopss!',
                                data.replace('Error: ',''),
                                'error'
                            )
                        }
                    },
                    'error': function (err) {
                        console.log(err);
                    }
                })
    })

    $('#forgot_button').click((e) => {
        Swal.fire({
          title: 'Enter your email',
          input: 'text',
          customClass: {
            validationMessage: 'my-validation-message'
          },
          preConfirm: (value) => {
            if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
                Swal.showValidationMessage(
                ' Email not valid'
                )
            }
          }
        }).then((data) => {
            if (data.isConfirmed) {
                $.ajax({
                    'type': 'POST',
                    'url': '/forgot-sent',
                    'contentType': 'application/json',
                    'data': JSON.stringify({ email: data.value, host: window.location.origin }),
                    // 'dataType': 'json',
                    'success': (data) => {
                        // console.log(data);
                        if (data.includes('OK')) {
                            Swal.fire(
                                'Verification sent!',
                                'Please check your email for activation.',
                                'success'
                            )                            
                            // window.location.href = window.location.origin + '/dashboard' + '?auth=' + auth + '&forgot=success'
                            
                        } else {
                            Swal.fire(
                                'Woopss!',
                                data.replace('Error: ',''),
                                'error'
                            )
                        }
                    },
                    'error': function (err) {
                        console.log(err);
                    }
                })
            }
        })
    })

    $('input#user').keyup(() => {
        var user = $('input#user').val()
        $('input#user').val(user.replace(/ /g,''))
    })

    $('input#pass').keyup(() => {
        var pass = $('input#pass').val()
        $('input#pass').val(pass.replace(/ /g,''))
    })

    $("#account_type").click((e) => {
        const element = $('#account_type').val()
        const date = document.getElementById('expired_on')
        if (element == 'premium') {
            $('#expired-label').css('display', 'initial')
            date.type = 'date'
        } else {
            date.type = 'hidden'
            $('#expired-label').css('display', 'none')
        }
    })

    $('#showPass').click((e) => {
        const element = document.getElementById('password')
        if (element.type == 'password') {
            element.type = 'text'
            $('#showPass').removeClass('fi-rr-eye-crossed')
            $('#showPass').addClass('fi-rr-eye')
        } else {
            element.type = 'password'
            $('#showPass').removeClass('fi-rr-eye')
            $('#showPass').addClass('fi-rr-eye-crossed')
        }
    })


    $('#changeAvatar').click((e) => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const auth = urlParams.get('auth')
        var api = '/action/changePP';
        Swal.fire({
            title: "Profile Photo Change",
            html:  `<form accept="image/*" enctype="multipart/form-data" action="${api}" method="post">
                      <input type="file" name="avatar" required>
                      <input type="hidden" name="auth" id="token" value="${auth}">
                      <input type="hidden" name="username" id="userpp" value="${$('#c-tusername').text()}">
                      <input type="submit" class="swal2-confirm swal2-styled" style="margin-top: 30px" value="Ok">
                    </form>`,
            showConfirmButton: false,
            preConfirm: () => {
                console.log(value)
                if (!value) {
                    Swal.showValidationMessage(
                        ' Please insert image file'
                    )
                }
            }
        })
        // .then(function() {
        //     var formData = new FormData();
        //     formData.append('avatar', $('#ups').val().replace(/.*(\/|\\)/, ''));
        //     console.log(formData);
        //     $.ajax({
        //       type: 'POST',
        //       url: api,
        //       data: formData,
        //       // dataType: 'json',
        //       processData: false,
        //       // contentType: false,
        //       // headers: {"Content-Type":"form-data"},
        //       // async: true,
        //       success: function(result){
        //         console.log("OK client side");
        //         console.log(result.Response);
        //       }
        //     });
        // })
    })

    $('#changeAvatars').click((e) => {
        Swal.fire({
          title: 'Enter image url',
          input: 'text',
          customClass: {
            validationMessage: 'my-validation-message'
          },
          preConfirm: (value) => {
            if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g.test(value)) {
                Swal.showValidationMessage(
                ' Not a valid URL'
                )
            } else if (!value) {
              Swal.showValidationMessage(
                ' URL is required'
              )
            }
          }
        }).then((data) => {
            if (data.isConfirmed) {
                // console.log(data.value)
                setTimeout(() => {
                    $('.swal2-title').html('<i id="pp-load" style="top: -200px; position: absolute; right: 47%;" class="fas fa-spinner fa-spin"></i>Are you sure to save this picture?')
                    $('.swal2-image').attr('onload', "imgLoaded()")
                }, 100)
                Swal.fire({
                  title: 'Profile Picture Change',
                  text: ' ',
                  imageUrl: 'https://unsplash.it/400/200',
                  imageWidth: 300,
                  imageHeight: 300,
                  imageAlt: 'pp',
                  // html: '<i id="pp-load" class="fas fa-spinner fa-spin"></i>',
                  confirmButtonText: 'Yes, change it!',
                  cancelButtonText: 'No, cancel!',
                  showCancelButton: true,
                }).then((dt) => {
                    if (dt.isConfirmed) {
                         const queryString = window.location.search;
                         const urlParams = new URLSearchParams(queryString);
                         const auth = urlParams.get('auth')
                         const username = $('#c-tusername').text()
                         $.ajax({
                            'type': 'POST',
                            'url': '/action/changePP',
                            'contentType': 'application/json',
                            'data': JSON.stringify({ username, auth, profileURL: data.value }),
                            // 'dataType': 'json',
                            'success': (data) => {
                                // console.log(data);
                                if (data.includes('OK')) {
                                    Swal.fire(
                                        'Success!',
                                        'Profile Picture has been changed.',
                                        'success'
                                    ).then(() => {
                                        window.location.href = window.location.origin + window.location.pathname + '?auth=' + auth
                                    })
                                } else {
                                    Swal.fire(
                                        'Woopss!',
                                        data.replace('Error: ',''),
                                        'error'
                                    )
                                }
                            },
                            'error': function (err) {
                                console.log(err);
                            }
                        })
                    }
                })
            }
        })
    })

    /*
    CPU : bg-info
    RAM : bg-success
    MEMORY : bg-danger
    MS : bg-warning
    */
    $('.recaptcha-checkbox').click((e) => {
        $('#rc-anchor-container').css('border','1px solid #fff')
    })

    setInterval(() => {
        $('#rc-anchor-alert').innerHTML = ''
    }, 1000)
    
    $('#tab-2').click((e) => {
        window.grecaptchaForm = grecaptcha.render('google_recaptcha_form', {
            sitekey : '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
            callback: (data) => {

            }
        });
    })

    $('#requestRegister').click((e) => {
        const data = $('#register-form').serialize()
        const urlParams = new URLSearchParams(data);
        const username = urlParams.get('username')
        const password1 = urlParams.get('password1') 
        const password2 = urlParams.get('password2') 
        const phone = urlParams.get('phone').replace(/ /g,'')
        const email = urlParams.get('email').replace(/ /g,'') 
        // console.log(Swal)
        // if (!$('#recaptcha-form').val()) {
        //     Swal.fire('Recaptcha Required!')
        //     return
        // }
        document.getElementById('usereg').value = ''
        document.getElementById('pass1').value = ''
        document.getElementById('pass2').value = ''
        document.getElementById('phone').value = ''
        document.getElementById('email').value = ''
        $.ajax({
                'type': 'POST',
                'url': '/register',
                'contentType': 'application/json',
                'data': JSON.stringify({ username, password1, password2, phone, email, host: window.location.origin }),
                // 'dataType': 'json',
                'success': (data) => {
                    // console.log(data);
                    if (data.includes('OK')) {
                        Swal.fire(
                                'Verification sent!',
                                'Please check your email for activation.',
                                'success'
                            ).then(() => {
                                window.location.href = window.location.origin + '/login'
                            })
                    } else {
                        // console.log('Wrong')
                        // $('html').html(data)
                        Swal.fire(
                            'Woopss!',
                            data.replace('Error: ',''),
                            'error'
                        ).then(() => {
                                window.location.href = window.location.origin + '/login'
                        })
                    }
                },
                'error': function (err) {
                    console.log(err);
                }
            })


    })


        window.addEventListener("beforeunload", function (e) {
            if ($('body > div.wrapper > div.main-panel.ps > nav > div > div.navbar-wrapper > a').text() == " Admin") {   
                // var confirmationMessage = "\o/";

                // (e || window.event).returnValue = confirmationMessage; //Gecko + IE
                // return confirmationMessage;      
                window.ws.send(JSON.stringify({ action: 'disconnect', id: window.wsID}))                      //Webkit, Safari, Chrome
            }
          });

        window.addEventListener('load', (event) => {
            if ($('body > div.wrapper > div.main-panel.ps > nav > div > div.navbar-wrapper > a').text() == " Admin") {  

            }
        })

})
