webpackJsonp([6],{

/***/ 157:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _axios = __webpack_require__(2);

var _axios2 = _interopRequireDefault(_axios);

var _vue = __webpack_require__(3);

var _vue2 = _interopRequireDefault(_vue);

var _vueStrap = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Login = new _vue2.default({
    el: '#root',
    components: {
        alert: _vueStrap.alert
    },
    data: {
        input: '# hello',
        name: 'haris',
        showTop: false,
        email: '',
        errorMsg: ""
    },
    computed: {
        compiledMarkdown: function compiledMarkdown() {
            return this.input;
        }
    },
    methods: {
        submitFormEmail: function submitFormEmail(event) {
            var _this = this;

            event.preventDefault();
            $('#loadingModal').modal('show');
            _axios2.default.post('/session/' + this.email, {}, []).then(function (response) {
                $("#logInForm").submit();
            }).catch(function (error) {
                console.log(error);
                $('#loadingModal').modal('hide');
                _this.showAlertWithCustomMessage("Not valid user");
            });
        },
        openLoadingModal: function openLoadingModal(event) {
            event.preventDefault();
            $('#loadingModal').modal('show');
        },
        toCustomSignUp: function toCustomSignUp(event) {
            event.preventDefault();
            if (window.location.href.includes('professor')) {
                window.location.href = '/professor/signup';
            } else {
                window.location.href = '/student/signup';
            }
        },
        showAlertWithCustomMessage: function showAlertWithCustomMessage(message) {
            this.showTop = true;
            this.setAlertToFalse();
            this.errorMsg = message;
        },
        setAlertToFalse: function setAlertToFalse() {
            var self = this;
            setTimeout(function () {
                self.showTop = false;
            }, 3000);
        }
    },
    delimiters: ['${', '}']
});

exports.default = Login;

/***/ })

},[157]);