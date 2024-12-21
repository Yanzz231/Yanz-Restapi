const fs = require("fs");
const chalk = require("chalk");
const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const moment = require("moment");
const ws = require("ws");
const multer = require("multer");
const nodemailer = require("nodemailer");
const app = express();
const wsServer = new ws.Server({
  noServer: true,
});
var VitalSigns = require("vitalsigns");
var vitals = new VitalSigns();
vitals.monitor("cpu");
vitals.monitor("mem", {
  units: "MB",
});
vitals.monitor("tick");
vitals.monitor("uptime");
vitals.unhealthyWhen("cpu", "usage").equals(100);
vitals.unhealthyWhen("tick", "maxMs").greaterThan(500);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/uploads");
  },
  filename: function (req, file, cb) {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(
        ""
      );
    let randomName = [];
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomName.push(characters[randomIndex]);
    }
    const uniqueName = randomName.join("");
    cb(
      null,
      `${file.fieldname}-${uniqueName}.${file.originalname.split(".").pop()}`
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".png", ".jpg", ".gif", ".jpeg"];

    if (!allowedExtensions.includes(fileExtension)) {
      return callback("Only images are allowed");
    }

    callback(null, true);
  },
  onFileUploadStart: function (file) {},
});

class RestApi {
  constructor() {
    this.clientWsHealth = [];
    this.clientWs = [];
    this.clientWsTop = [];
    this.clientWsUser = [];
    this.settingsPath = "./src/settings.json";
    this.port = JSON.parse(fs.readFileSync(this.settingsPath)).PORT;
    this.settings = JSON.parse(fs.readFileSync(this.settingsPath));
    this.changelogScheme = JSON.parse(
      fs.readFileSync("./lib/pages/changelog.json")
    );
    this.scheme = JSON.parse(fs.readFileSync("./lib/pages/api-scheme.json"));
    this.db = JSON.parse(fs.readFileSync("./lib/database/clients.json"));
    this.db_visitor = JSON.parse(
      fs.readFileSync("./lib/database/visitors.json")
    );
    this.db_request = JSON.parse(
      fs.readFileSync("./lib/database/requests.json")
    );
    this.db_caklontong = JSON.parse(
      fs.readFileSync("./lib/database/game/caklontong.json")
    );
    this.db_susunkata = JSON.parse(
      fs.readFileSync("./lib/database/game/susunkata.json")
    );
    this.db_tebakgambar = JSON.parse(
      fs.readFileSync("./lib/database/game/tebakgambar.json")
    );
    this.db_tebaklagu = JSON.parse(
      fs.readFileSync("./lib/database/game/tebaklagu.json")
    );
    this.db_matheasy = JSON.parse(
      fs.readFileSync("./lib/database/game/matheasy.json")
    );
    this.db_mathmedium = JSON.parse(
      fs.readFileSync("./lib/database/game/mathmedium.json")
    );
    this.db_mathpro = JSON.parse(
      fs.readFileSync("./lib/database/game/mathpro.json")
    );
    this.db_mathextreme = JSON.parse(
      fs.readFileSync("./lib/database/game/mathextreme.json")
    );
    this.db_mathimpossible = JSON.parse(
      fs.readFileSync("./lib/database/game/mathimpossible.json")
    );
    this.db_mathimpossible2 = JSON.parse(
      fs.readFileSync("./lib/database/game/mathimpossible2.json")
    );
    this.db_family100 = JSON.parse(
      fs.readFileSync("./lib/database/game/family100.json")
    );
    this.db_sambungkata = JSON.parse(
      fs.readFileSync("./lib/database/game/sambungkata.json")
    );
    this.db_tebakjenaka = JSON.parse(
      fs.readFileSync("./lib/database/game/tebakjenaka.json")
    );
    this.db_siapakahaku = JSON.parse(
      fs.readFileSync("./lib/database/game/siapaaku.json")
    );
    this.db_tebakbendera = JSON.parse(
      fs.readFileSync("./lib/database/game/tebakbendera.json")
    );
    this.db_dare = JSON.parse(fs.readFileSync("./lib/database/game/dare.json"));
    this.db_endare = JSON.parse(
      fs.readFileSync("./lib/database/game/endare.json")
    );
    this.db_truth = JSON.parse(
      fs.readFileSync("./lib/database/game/truth.json")
    );
    this.db_entruth = JSON.parse(
      fs.readFileSync("./lib/database/game/entruth.json")
    );
    this.db_kimia = JSON.parse(
      fs.readFileSync("./lib/database/game/kimia.json")
    );
    this.db_asahotak = JSON.parse(
      fs.readFileSync("./lib/database/game/asahotak.json")
    );
    this.db_bijak = JSON.parse(
      fs.readFileSync("./lib/database/randomtext/bijak.json")
    );
    this.db_cerpen = JSON.parse(
      fs.readFileSync("./lib/database/randomtext/cerpen.json")
    );
    this.db_epep = JSON.parse(
      fs.readFileSync("./lib/database/randomtext/epep.json")
    );
    this.db_katasenja = JSON.parse(
      fs.readFileSync("./lib/database/randomtext/katasenja.json")
    );
    this.db_fakta = JSON.parse(
      fs.readFileSync("./lib/database/randomtext/fakta.json")
    );
    this.db_fakedata = JSON.parse(
      fs.readFileSync("./lib/database/randomtext/fakedate.json")
    );
    this.db_motivasi = JSON.parse(
      fs.readFileSync("./lib/database/randomtext/motivasi.json")
    );
    this.db_nama = JSON.parse(
      fs.readFileSync("./lib/database/randomtext/nama.json")
    );
    this.db_quotes = JSON.parse(
      fs.readFileSync("./lib/database/randomtext/quotes.json")
    );
    this.db_quotesanime = JSON.parse(
      fs.readFileSync("./lib/database/randomtext/quotesanime.json")
    );
    this.db_quotesdilan = JSON.parse(
      fs.readFileSync("./lib/database/randomtext/quotesdilan.json")
    );
    this.db_quotesen = JSON.parse(
      fs.readFileSync("./lib/database/randomtext/quotesen.json")
    );
    this.db_quotesislam = JSON.parse(
      fs.readFileSync("./lib/database/randomtext/quotesislam.json")
    );
    this.db_bucin = JSON.parse(
      fs.readFileSync("./lib/database/randomtext/bucin.json")
    );
    this.db_horor = JSON.parse(
      fs.readFileSync("./lib/database/randomtext/horor.json")
    );
    this.db_fuckmylife = JSON.parse(
      fs.readFileSync("./lib/database/randomtext/fuckmylife.json")
    );
    this.db_pantun = JSON.parse(
      fs.readFileSync("./lib/database/randomtext/pantun.json")
    );
    this.db_cersex = JSON.parse(
      fs.readFileSync("./lib/database/nsfw/cersex.json")
    );
  }
  app() {
    return app;
  }

  addRequest(ipAddress) {
    this.db_request.push({
      ip: ipAddress,
      timestamp: Date.now(),
    });
    fs.writeFileSync(
      "./lib/database/requests.json",
      JSON.stringify(this.db_request, null, 2)
    );
  }

  addVisitor(ipAddress) {
    if (!this.db_visitor.includes(ipAddress)) {
      this.db_visitor.push(ipAddress);
      fs.writeFileSync(
        "./lib/database/visitors.json",
        JSON.stringify(this.db_visitor, null, 2)
      );
    }
  }

  sendLogs(eventType = "login", details = {}) {
    console.log(
      chalk.blueBright(`Type : ${eventType}`) +
        ` From : ${details.ip ?? "None"} ` +
        chalk.cyanBright(`To : ${details.page ?? "None"}`)
    );

    let logMessage = "";
    switch (eventType) {
      case "login":
        if (!details.username) {
          return {
            status: false,
            message: "Need username and IP parameter",
          };
        }
        logMessage = `
          <li class="list-group-item">
            <a style="color: yellow;">${details.username}</a>
            <a style="color: lime;">Has Logged in</a>
            <a style="color: #4a4aff;">With IP</a>
            <a style="color: red;">${details.ip ?? "-"}</a>
          </li>`;
        break;

      case "home":
        if (!details.username) {
          return {
            status: false,
            message: "Need username and IP parameter",
          };
        }
        logMessage = `
          <li class="list-group-item">
            <a style="color: yellow;">${details.username}</a>
            <a style="color: lime;">Open Page Home</a>
            <a style="color: #4a4aff;">With IP</a>
            <a style="color: red;">${details.ip ?? "-"}</a>
          </li>`;
        break;

      case "logout":
        if (!details.username) {
          return {
            status: false,
            message: "Need username parameter",
          };
        }
        logMessage = `
          <li class="list-group-item">
            <a style="color: yellow;">${details.username}</a>
            <a style="color: red;">Has Logged out</a>
          </li>`;
        break;

      case "regist":
        if (!details.email) {
          return {
            status: false,
            message: "Need email parameter",
          };
        }
        logMessage = `
          <li class="list-group-item">
            <a style="color: #00c4ff;">OTP Register</a>
            <a style="color: lime;">sent to</a>
            <a style="color: #ff3838;">${details.email}</a>
          </li>`;
        break;

      case "forgot":
        if (!details.email) {
          return {
            status: false,
            message: "Need email parameter",
          };
        }
        logMessage = `
          <li class="list-group-item">
            <a style="color: #00c4ff;">OTP Forgot Password</a>
            <a style="color: lime;">sent to</a>
            <a style="color: #ff3838;">${details.email}</a>
          </li>`;
        break;

      case "request":
        if (!details.apiname || !details.username) {
          return {
            status: false,
            message: "Need API name and username parameter",
          };
        }
        logMessage = `
          <li class="list-group-item">
            <a style="color: #814cff;">Request API</a>
            <a style="color: #fff800;">${details.apiname}</a>
            <a style="color: lime;">from</a>
            <a style="color: #ff3838;">${details.username}</a>
            <a style="color: #00f2c3;">IP</a>
            <a style="color: #ff8e00;">${details.ip ?? "-"}</a>
          </li>`;
        break;

      case "page":
        if (!details.page) {
          return {
            status: false,
            message: "Need page parameter",
          };
        }
        logMessage = `
          <li class="list-group-item">
            <a style="color: lime;">${details.page}</a>
            <a style="color: #814cff;">Opened With IP</a>
            <a style="color: #fba300;">${details.ip ?? "-"}</a>
          </li>`;
        break;

      default:
        return {
          status: false,
          message: "Invalid Type",
        };
    }

    this.clientWs
      .map((client) => client.socket)
      .forEach((socket) => {
        socket.send(logMessage);
      });

    return {
      status: true,
      result: logMessage,
    };
  }

  sendMail(mailDetails) {
    return new Promise((resolve, reject) => {
      // Konfigurasi transport Nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ap98an@gmail.com", // Email pengirim
          pass: "kontol123lolmeks", // Password pengirim (gunakan .env untuk keamanan)
        },
      });

      // Cari pengguna berdasarkan username
      const userIndex = this.db.findIndex(
        (user) => user.username === mailDetails.username
      );
      if (userIndex === -1) {
        return reject({
          status: false,
          message: "Not a registered user",
        });
      }

      // Konfigurasi email
      const mailOptions = {
        from: "ap98an@gmail.com",
        to: mailDetails.email,
        subject: mailDetails.subject,
        html: this.verifyHtml({
          username: mailDetails.username,
          url: mailDetails.url,
          type: mailDetails.type,
        }),
      };

      // Kirim email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return reject({
            status: false,
            message: error.message,
          });
        }
        return resolve({
          status: true,
          data: info,
        });
      });
    });
  }

  removeWsClient(client) {
    this.clientWs = this.clientWs.filter(
      (wsClient) => wsClient.id !== client.id
    );
    this.clientWsHealth = this.clientWsHealth.filter(
      (wsClient) => wsClient.id !== client.id
    );
    this.clientWsTop = this.clientWsTop.filter(
      (wsClient) => wsClient.id !== client.id
    );
    this.clientWsUser = this.clientWsUser.filter(
      (wsClient) => wsClient.id !== client.id
    );
  }

  start() {
    setInterval(() => {
      this.clientWsHealth
        .map((client) => client.socket)
        .forEach((socket) => {
          const healthReport = JSON.stringify(vitals.getReport(), null, 2);
          socket.send(healthReport);
        });

      this.clientWsTop
        .map((client) => client.socket)
        .forEach((socket) => {
          const topUsers = this.userTopGenerate(
            this.db.sort((a, b) => b.usage.total - a.usage.total)
          );
          socket.send(topUsers);
        });

      this.clientWsUser.forEach((client) => {
        const userTableData = JSON.stringify(
          this.clientWs.map((wsClient) => {
            const clientIndex = this.clientWs.findIndex(
              (client) => client.auth === wsClient.auth
            );

            if (clientIndex !== -1) {
              this.clientWs[clientIndex].html = this.userTableGenerate(
                this.db,
                wsClient.auth
              );
            }

            return {
              id: wsClient.id,
              auth: wsClient.auth,
              html: wsClient.html,
              total: this.db.length,
            };
          }),
          null,
          2
        );

        client.socket.send(userTableData);
      });
    }, 1000);

    wsServer.on("connection", (socket, request) => {
      console.log("Connected", request.url);

      if (request.url === "/health") {
        this.clientWsHealth.push({
          id: this.clientWsHealth.length + 1,
          socket: socket,
        });
        socket.send(
          JSON.stringify({
            id: this.clientWsHealth.length,
          })
        );
      } else if (request.url === "/topreq") {
        this.clientWsTop.push({
          id: this.clientWsTop.length + 1,
          socket: socket,
        });
        socket.send(
          JSON.stringify({
            id: this.clientWsTop.length,
          })
        );
      } else if (request.url === "/request") {
        this.clientWsUser.push({
          id: this.clientWsUser.length + 1,
          socket: socket,
        });
        socket.send(
          JSON.stringify({
            id: this.clientWsUser.length,
          })
        );
      } else {
        this.clientWs.push({
          id: this.clientWs.length + 1,
          socket: socket,
        });
        socket.send(
          JSON.stringify({
            id: this.clientWs.length,
          })
        );
      }

      socket.on("message", (message) => {
        setTimeout(() => {
          try {
            const parsedMessage = JSON.parse(message);
            const clientIndex = this.clientWs.findIndex(
              (client) => client.id === parsedMessage.id
            );
            if (clientIndex !== -1) {
              this.clientWs[clientIndex].auth = parsedMessage?.auth;
            }
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        }, 1000);
      });

      socket.on("close", () => {
        if (request.url === "/health") {
          this.clientWsHealth = this.clientWsHealth.filter(
            (client) => client.socket !== socket
          );
        } else if (request.url === "/topreq") {
          this.clientWsTop = this.clientWsTop.filter(
            (client) => client.socket !== socket
          );
        } else if (request.url === "/request") {
          this.clientWsUser = this.clientWsUser.filter(
            (client) => client.socket !== socket
          );
        } else {
          this.clientWs = this.clientWs.filter(
            (client) => client.socket !== socket
          );
        }
      });
    });

    app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
    app.use(express.json());
    app.use(
      express.urlencoded({
        extended: true,
      })
    );
    app.use(express.static(path.join(__dirname, "/static")));
    app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
    app.use("/action", express.static(path.join(__dirname, "/static")));

    require(path.join(__dirname, "/pages/endpoint.js"))(app, this);

    app.get("/health", vitals.express);

    app.get("/api", (req, res) => {
      const clientIP =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const sanitizedIP = clientIP.replace(/\:|f|\:\:1/g, "");

      this.addRequest(sanitizedIP);
      res.sendFile(path.join(__dirname, "pages", "bgtest.html"));
      this.sendLogs("page", {
        page: "/api",
        ip: sanitizedIP,
      });
    });

    app.get("/login", (req, res) => {
      res.sendFile(path.join(__dirname, "pages/login.html"));
      const clientIP =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const sanitizedIP = clientIP.replace(/\:|f|\:\:1/g, "");

      this.addVisitor(sanitizedIP);
      this.sendLogs("page", {
        page: "/login",
        ip: sanitizedIP,
      });
    });

    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "static/home.html"));
      const clientIP =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const sanitizedIP = clientIP.replace(/\:|f|\:\:1/g, "");

      this.addVisitor(sanitizedIP);
      this.sendLogs("page", {
        page: "/home",
        ip: sanitizedIP,
      });
    });

    app.get("/register", (req, res) => {
      res.sendFile(path.join(__dirname, "pages/register.html"));
      const clientIP =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const sanitizedIP = clientIP.replace(/\:|f|\:\:1/g, "");

      this.addVisitor(sanitizedIP);
      this.sendLogs("page", {
        page: "/register",
        ip: sanitizedIP,
      });
    });

    app.post("/register", (req, res) => {
      const clientIP =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const sanitizedIP = clientIP.replace(/\:|f|\:\:1/g, "");

      this.addVisitor(sanitizedIP);

      const { username, password1, password2, email, phone, host } = req.body;

      const registrationResult = this.requestRegister(
        username,
        password1,
        password2,
        email,
        phone,
        sanitizedIP
      );

      if (registrationResult.status) {
        const authToken = this.generate_token(406);
        const userIndex = this.db.findIndex(
          (user) => user.username === username
        );
        if (userIndex !== -1) {
          this.db[userIndex].auth = authToken;
        }

        fs.writeFileSync(
          "./lib/database/clients.json",
          JSON.stringify(this.db, null, 2)
        );

        this.sendLogs("regist", { email: registrationResult.data.email });

        this.sendMail({
          type: "email",
          subject: "Email verification",
          username: username,
          email: registrationResult.data.email,
          url: `${host}/dashboard?auth=${authToken}&action=verify`,
        })
          .then((emailResult) => {
            if (emailResult.status) {
              res.sendStatus(200); // Sukses
            } else {
              res.send(
                "Error: Failed to send email OTP, please contact admin!"
              );
            }
          })
          .catch((error) => {
            console.error(error);
            res.sendStatus(403);
          });
      } else {
        res.send("Error: " + registrationResult.message);
      }
    });

    app.post("/verify", (req, res) => {
      const clientIP =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const sanitizedIP = clientIP.replace(/\:|f|\:\:1/g, "");

      this.addVisitor(sanitizedIP);

      const { auth } = req.body;
      const authData = this.getDataFromAuth(auth);

      if (authData.status) {
        this.db[authData.userindex].status = "true";
        fs.writeFileSync(
          "./lib/database/clients.json",
          JSON.stringify(this.db, null, 2)
        );
        res.sendStatus(200);
      } else {
        res.send("Error: " + authData.message);
      }
    });

    app.get("/forgot-password", (req, res) => {
      const clientIP =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const sanitizedIP = clientIP.replace(/\:|f|\:\:1/g, "");

      this.addVisitor(sanitizedIP);

      const { auth, pass1, pass2, action } = req.query;
      const authData = this.getDataFromAuth(auth);

      if (!action) {
        return res.sendFile(path.join(__dirname, "pages/login.html"));
      }

      if (action === "forgot") {
        res.sendFile(path.join(__dirname, "pages/forgot-pass.html"));
      } else if (action === "submit") {
        if (authData.status) {
          this.db[authData.userindex].last_ip = sanitizedIP;
          this.forceReplaceClients(this.db);

          if (pass1 === pass2) {
            this.db[authData.userindex].password = pass1;
            res.sendStatus(200);
          } else {
            res.send("Error: Password does not match!");
          }
        } else {
          res.send("Error: " + authData.message);
        }
      }
    });

    app.post("/forgot-sent", (req, res) => {
      const clientIP =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const sanitizedIP = clientIP.replace(/\:|f|\:\:1/g, "");

      this.addVisitor(sanitizedIP);

      const { email, host } = req.body;
      const emailData = this.getDataFromEmail(email);
      const authToken = this.generate_token(406);

      if (emailData.status) {
        this.sendMail({
          type: "otp",
          subject: "Reset password verification",
          email: email,
          username: emailData?.data?.username,
          url: `${host}/forgot-password?auth=${authToken}&action=forgot`,
        })
          .then((emailResult) => {
            this.sendLogs("forgot", { email });

            if (emailResult.status) {
              this.db[emailData.userindex].auth = authToken;
              res.sendStatus(200);
            } else {
              res.send(
                "Error: Failed to send email OTP, please contact admin!"
              );
            }
          })
          .catch((error) => {
            console.error(error);
            res.send("Error: Failed to send email OTP, please contact admin!");
          });
      } else {
        res.send("Error: This email is not registered");
      }
    });

    app.get("/dashboard", (req, res) => {
      const clientIP =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const sanitizedIP = clientIP.replace(/:|f|::1/g, "");

      this.addVisitor(sanitizedIP);
      this.sendLogs("page", { page: "/dashboard", ip: sanitizedIP });

      if (!req.query.auth) {
        const typeList = this.typeListGenerate(this.scheme);
        const today = new Date();
        const requestsToday = this.filterByTimestamp(this.db_request, {
          date: today.getDate(),
          month: today.getMonth(),
          year: today.getFullYear(),
        });

        res.send(
          this.stringHtml(
            "guest",
            this.db_visitor.length,
            this.db.length,
            this.db_request.length,
            requestsToday.length,
            this.settings.Features,
            this.settings.Active,
            this.settings.Error,
            "Please Login",
            typeList,
            "dashboard",
            undefined,
            undefined,
            "guest@yanz.id",
            {}
          )
        );
      } else {
        const authData = this.getDataFromAuth(req.query.auth);
        const typeList = this.typeListGenerate(this.scheme, req.query.auth);
        const today = new Date();
        const requestsToday = this.filterByTimestamp(this.db_request, {
          date: today.getDate(),
          month: today.getMonth(),
          year: today.getFullYear(),
        });

        if (!authData || authData.data.last_ip !== sanitizedIP) {
          const changelog = this.changelogListGenerate(this.changelogScheme);
          res.send(
            this.stringHtml(
              authData?.data?.username || "guest",
              this.db_visitor.length,
              this.db.length,
              this.db_request.length,
              requestsToday.length,
              this.settings.Features,
              this.settings.Active,
              this.settings.Error,
              authData?.data?.usage?.touched || "Please Login",
              typeList,
              "blank",
              req.query.auth,
              changelog,
              authData?.data?.email || "guest@yanz.id",
              {
                ...authData?.data,
                message: "Invalid Authentication",
                status: false,
                notifStatus: true,
              }
            )
          );
          return;
        }

        res.send(
          this.stringHtml(
            authData.data.username || "Guest",
            this.db_visitor.length,
            this.db.length,
            this.db_request.length,
            requestsToday.length,
            this.settings.Features,
            this.settings.Active,
            this.settings.Error,
            authData.data.usage.touched || "Please Login",
            typeList,
            "dashboard",
            req.query.auth,
            undefined,
            authData.data.email || "guest@yanz.id",
            authData.data
          )
        );
      }
    });

    app.post("/dashboard", (req, res) => {
      let clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      clientIP = clientIP.replace(/\:|f|\:\:1/g, "");
      this.addVisitor(clientIP);

      const { username, password } = req.body;
      const loginResult = this.requestLogin(username, password);

      if (loginResult.status) {
        const authToken = this.generate_token(406);
        const userIndex = this.db.findIndex(
          (user) => user.username == username
        );

        if (userIndex != -1) {
          this.db[userIndex].auth = authToken;
          this.db[userIndex].last_ip = clientIP;
          this.pushIpDb(clientIP, this.db[userIndex].username);
        }

        fs.writeFileSync(
          "./lib/database/clients.json",
          JSON.stringify(this.db, null, 5)
        );

        const menuItems = this.typeListGenerate(this.scheme, authToken);
        const currentDate = new Date();
        const todayRequests = this.filterByTimestamp(this.db_request, {
          date: currentDate.getDate(),
          month: currentDate.getMonth(),
          year: currentDate.getFullYear(),
        });

        res.send(
          this.stringHtml(
            loginResult.data.username,
            this.db_visitor.length,
            this.db.length,
            this.db_request.length,
            todayRequests.length,
            this.settings.Features,
            this.settings.Active,
            this.settings.Error,
            this.db[userIndex].usage.touched,
            menuItems,
            "dashboard",
            authToken,
            undefined,
            loginResult.data.email,
            this.db[userIndex]
          )
        );
      } else {
        res.sendFile(path.join(__dirname, "pages/login-a.html"));
      }
    });
    app.get("/pricing", (req, res) => {
      const clientIP =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const sanitizedIP = clientIP.replace(/:|f|::1/g, "");

      this.addVisitor(sanitizedIP);
      this.sendLogs("page", { page: "/pricing", ip: sanitizedIP });

      if (!req.query.auth) {
        const typeList = this.typeListGenerate(this.scheme);
        const today = new Date();
        const requestsToday = this.filterByTimestamp(this.db_request, {
          date: today.getDate(),
          month: today.getMonth(),
          year: today.getFullYear(),
        });

        res.send(
          this.stringHtml(
            "guest",
            this.db_visitor.length,
            this.db.length,
            this.db_request.length,
            requestsToday.length,
            this.settings.Features,
            this.settings.Active,
            this.settings.Error,
            "Please Login",
            typeList,
            "pricing",
            undefined,
            undefined,
            "guest@yanz.id",
            {}
          )
        );
      } else {
        const authData = this.getDataFromAuth(req.query.auth);
        const typeList = this.typeListGenerate(this.scheme, req.query.auth);

        if (!authData || authData.data.last_ip !== sanitizedIP) {
          const changelog = this.changelogListGenerate(this.changelogScheme);
          res.send(
            this.stringHtml(
              authData?.data?.username || "guest",
              this.db_visitor.length,
              this.db.length,
              this.db_request.length,
              requestsToday.length,
              this.settings.Features,
              this.settings.Active,
              this.settings.Error,
              authData?.data?.usage?.touched || "Please Login",
              typeList,
              "blank",
              req.query.auth,
              changelog,
              authData?.data?.email || "guest@yanz.id",
              {
                ...authData?.data,
                message: "Invalid Authentication",
                status: false,
                notifStatus: true,
              }
            )
          );
          return;
        }

        res.send(
          this.stringHtml(
            authData.data.username || "Guest",
            this.db_visitor.length,
            this.db.length,
            this.db_request.length,
            requestsToday.length,
            this.settings.Features,
            this.settings.Active,
            this.settings.Error,
            authData.data.usage.touched || "Please Login",
            typeList,
            "pricing",
            req.query.auth,
            undefined,
            authData.data.email || "guest@yanz.id",
            authData.data
          )
        );
      }
    });

    app.get("/changelog", (req, res) => {
      const clientIP =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const sanitizedIP = clientIP.replace(/:|f|::1/g, "");

      this.addVisitor(sanitizedIP);
      const changelogContent = this.changelogListGenerate(this.changelogScheme);
      this.sendLogs("page", { page: "/changelog", ip: sanitizedIP });

      if (!req.query.auth) {
        const typeList = this.typeListGenerate(this.scheme);
        const today = new Date();
        const requestsToday = this.filterByTimestamp(this.db_request, {
          date: today.getDate(),
          month: today.getMonth(),
          year: today.getFullYear(),
        });

        res.send(
          this.stringHtml(
            "guest",
            this.db_visitor.length,
            this.db.length,
            this.db_request.length,
            requestsToday.length,
            this.settings.Features,
            this.settings.Active,
            this.settings.Error,
            "Please Login",
            typeList,
            "changelog",
            undefined,
            changelogContent,
            "guest@yanz.id",
            {}
          )
        );
      } else {
        const authData = this.getDataFromAuth(req.query.auth);
        const typeList = this.typeListGenerate(this.scheme, req.query.auth);
        const today = new Date();
        const requestsToday = this.filterByTimestamp(this.db_request, {
          date: today.getDate(),
          month: today.getMonth(),
          year: today.getFullYear(),
        });

        if (!authData || authData.data.last_ip !== sanitizedIP) {
          const changelog = this.changelogListGenerate(this.changelogScheme);
          res.send(
            this.stringHtml(
              authData?.data?.username || "guest",
              this.db_visitor.length,
              this.db.length,
              this.db_request.length,
              requestsToday.length,
              this.settings.Features,
              this.settings.Active,
              this.settings.Error,
              authData?.data?.usage?.touched || "Please Login",
              typeList,
              "blank",
              req.query.auth,
              changelog,
              authData?.data?.email || "guest@yanz.id",
              {
                ...authData?.data,
                message: "Invalid Authentication",
                status: false,
                notifStatus: true,
              }
            )
          );
          return;
        }

        res.send(
          this.stringHtml(
            authData.data.username || "guest",
            this.db_visitor.length,
            this.db.length,
            this.db_request.length,
            requestsToday.length,
            this.settings.Features,
            this.settings.Active,
            this.settings.Error,
            authData.data.usage.touched || "Please Login",
            typeList,
            "changelog",
            req.query.auth,
            changelogContent,
            authData.data.email || "guest@yanz.id",
            authData.data
          )
        );
      }
    });

    app.get("/admin", (req, res) => {
      const clientIP =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const sanitizedIP = clientIP.replace(/:|f|::1/g, "");

      this.addVisitor(sanitizedIP);
      const changelogContent = this.changelogListGenerate(this.changelogScheme);
      this.sendLogs("page", { page: "/admin", ip: sanitizedIP });

      if (!req.query.auth) {
        const typeList = this.typeListGenerate(this.scheme);
        const today = new Date();
        const requestsToday = this.filterByTimestamp(this.db_request, {
          date: today.getDate(),
          month: today.getMonth(),
          year: today.getFullYear(),
        });

        res.send(
          this.stringHtml(
            "guest",
            this.db_visitor.length,
            this.db.length,
            this.db_request.length,
            requestsToday.length,
            this.settings.Features,
            this.settings.Active,
            this.settings.Error,
            "Please Login",
            typeList,
            "admin",
            undefined,
            changelogContent,
            "guest@yanz.id",
            {}
          )
        );
      } else {
        const authData = this.getDataFromAuth(req.query.auth);
        const userTable = this.userTableGenerate(this.db, req.query.auth);
        const typeList = this.typeListGenerate(this.scheme, req.query.auth);
        const today = new Date();
        const requestsToday = this.filterByTimestamp(this.db_request, {
          date: today.getDate(),
          month: today.getMonth(),
          year: today.getFullYear(),
        });

        if (!authData || authData.data.last_ip !== sanitizedIP) {
          const changelog = this.changelogListGenerate(this.changelogScheme);
          res.send(
            this.stringHtml(
              authData?.data?.username || "guest",
              this.db_visitor.length,
              this.db.length,
              this.db_request.length,
              requestsToday.length,
              this.settings.Features,
              this.settings.Active,
              this.settings.Error,
              authData?.data?.usage?.touched || "Please Login",
              typeList,
              "blank",
              req.query.auth,
              changelog,
              authData?.data?.email || "guest@yanz.id",
              {
                ...authData?.data,
                message: "Invalid Authentication",
                status: false,
                notifStatus: true,
              }
            )
          );
          return;
        }

        res.send(
          this.stringHtml(
            authData.data.username || "guest",
            this.db_visitor.length,
            this.db.length,
            this.db_request.length,
            requestsToday.length,
            this.settings.Features,
            this.settings.Active,
            this.settings.Error,
            authData.data.usage.touched || "Please Login",
            typeList,
            "admin",
            req.query.auth,
            changelogContent,
            authData.data.email || "guest@yanz.id",
            {
              ...authData.data,
              userTable: userTable,
            }
          )
        );
      }
    });

    app.get("/profile", (req, res) => {
      const clientIP =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const sanitizedIP = clientIP.replace(/:|f|::1/g, "");

      this.addVisitor(sanitizedIP);
      const changelogContent = this.changelogListGenerate(this.changelogScheme);
      this.sendLogs("page", { page: "/profile", ip: sanitizedIP });

      if (!req.query.auth) {
        const typeList = this.typeListGenerate(this.scheme);
        const today = new Date();
        const requestsToday = this.filterByTimestamp(this.db_request, {
          date: today.getDate(),
          month: today.getMonth(),
          year: today.getFullYear(),
        });

        res.send(
          this.stringHtml(
            "guest",
            this.db_visitor.length,
            this.db.length,
            this.db_request.length,
            requestsToday.length,
            this.settings.Features,
            this.settings.Active,
            this.settings.Error,
            "Please Login",
            typeList,
            "profile",
            undefined,
            changelogContent,
            "guest@yanz.id",
            {}
          )
        );
      } else {
        const authData = this.getDataFromAuth(req.query.auth);
        const typeList = this.typeListGenerate(this.scheme, req.query.auth);
        const today = new Date();
        const requestsToday = this.filterByTimestamp(this.db_request, {
          date: today.getDate(),
          month: today.getMonth(),
          year: today.getFullYear(),
        });

        if (!authData || authData.data.last_ip !== sanitizedIP) {
          const changelog = this.changelogListGenerate(this.changelogScheme);
          res.send(
            this.stringHtml(
              authData?.data?.username || "guest",
              this.db_visitor.length,
              this.db.length,
              this.db_request.length,
              requestsToday.length,
              this.settings.Features,
              this.settings.Active,
              this.settings.Error,
              authData?.data?.usage?.touched || "Please Login",
              typeList,
              "blank",
              req.query.auth,
              changelog,
              authData?.data?.email || "guest@yanz.id",
              {
                ...authData?.data,
                message: "Invalid Authentication",
                status: false,
                notifStatus: true,
              }
            )
          );
          return;
        }

        res.send(
          this.stringHtml(
            authData.data.username || "guest",
            this.db_visitor.length,
            this.db.length,
            this.db_request.length,
            requestsToday.length,
            this.settings.Features,
            this.settings.Active,
            this.settings.Error,
            authData.data.usage.touched || "Please Login",
            typeList,
            "profile",
            req.query.auth,
            changelogContent,
            authData.data.email || "guest@yanz.id",
            authData.data
          )
        );
      }
    });

    app.get("/search", (req, res) => {
      const clientIP =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const sanitizedIP = clientIP.replace(/:|f|::1/g, "");

      this.addVisitor(sanitizedIP);
      const changelogContent = this.changelogListGenerate(this.changelogScheme);
      this.sendLogs("page", { page: "/search", ip: sanitizedIP });

      const { q: searchQuery } = req.query;
      if (!searchQuery) {
        return;
      }

      if (!req.query.auth) {
        const allCards = [].concat(...this.scheme.map((scheme) => scheme.card));
        const filteredCards = allCards.filter(
          (card) =>
            card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const searchResults = this.searchListGenerate(filteredCards);
        const typeList = this.typeListGenerate(this.scheme);
        const today = new Date();
        const requestsToday = this.filterByTimestamp(this.db_request, {
          date: today.getDate(),
          month: today.getMonth(),
          year: today.getFullYear(),
        });

        res.send(
          this.stringHtml(
            "guest",
            this.db_visitor.length,
            this.db.length,
            this.db_request.length,
            requestsToday.length,
            this.settings.Features,
            this.settings.Active,
            this.settings.Error,
            "Please Login",
            typeList,
            "search",
            undefined,
            changelogContent,
            "guest@yanz.id",
            { cardSearchList: searchResults, searchName: searchQuery }
          )
        );
      } else {
        const allCards = [].concat(...this.scheme.map((scheme) => scheme.card));
        const filteredCards = allCards.filter(
          (card) =>
            card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const searchResults = this.searchListGenerate(
          filteredCards,
          req.query.auth
        );
        const authData = this.getDataFromAuth(req.query.auth);
        const typeList = this.typeListGenerate(this.scheme, req.query.auth);
        const today = new Date();
        const requestsToday = this.filterByTimestamp(this.db_request, {
          date: today.getDate(),
          month: today.getMonth(),
          year: today.getFullYear(),
        });

        if (!authData || authData?.data?.last_ip !== sanitizedIP) {
          const changelog = this.changelogListGenerate(this.changelogScheme);
          res.send(
            this.stringHtml(
              authData?.data?.username || "guest",
              this.db_visitor.length,
              this.db.length,
              this.db_request.length,
              requestsToday.length,
              this.settings.Features,
              this.settings.Active,
              this.settings.Error,
              authData?.data?.usage?.touched || "Please Login",
              typeList,
              "blank",
              req.query.auth,
              changelog,
              authData?.data?.email || "guest@yanz.id",
              {
                ...authData?.data,
                message: "Invalid Authentication",
                status: false,
                notifStatus: true,
              }
            )
          );
          return;
        }

        res.send(
          this.stringHtml(
            authData.data.username || "guest",
            this.db_visitor.length,
            this.db.length,
            this.db_request.length,
            requestsToday.length,
            this.settings.Features,
            this.settings.Active,
            this.settings.Error,
            authData.data.usage.touched || "Please Login",
            typeList,
            "search",
            req.query.auth,
            changelogContent,
            authData.data.email || "guest@yanz.id",
            { cardSearchList: searchResults, searchName: searchQuery }
          )
        );
      }
    });

    app.post("/profile", (req, res) => {
      const clientIP =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const sanitizedIP = clientIP.replace(/:|f|::1/g, "");

      this.addVisitor(sanitizedIP);
      this.sendLogs("page", { page: "/profile", ip: sanitizedIP });

      const changelogContent = this.changelogListGenerate(this.changelogScheme);
      let {
        auth,
        message,
        type,
        newusername,
        username,
        email,
        oldpassword,
        newpassword,
        confirmnewpassword,
        apikey,
      } = req.body;

      const authData = this.getDataFromAuth(auth);
      let isNotificationDisplayed;
      let updateData;

      if (type === "useremail") {
        updateData = { username: newusername, email: email };
      } else if (type === "password") {
        updateData = {
          oldpassword: oldpassword,
          newpassword: newpassword,
          confirmnewpassword: confirmnewpassword,
        };
      } else if (type === "apikey") {
        updateData = { apikey: apikey };
      } else {
        isNotificationDisplayed = false;
      }

      const updateResult = this.changeProfile(username, type, updateData);

      if (updateResult.status) {
        isNotificationDisplayed = true;
        this.db[updateResult.index] = updateResult.data;
        fs.writeFileSync(
          "./lib/database/clients.json",
          JSON.stringify(this.db, null, 2)
        );
      } else {
        isNotificationDisplayed = true;
        message = updateResult.message;
      }

      const typeList = this.typeListGenerate(this.scheme, auth);
      const today = new Date();
      const requestsToday = this.filterByTimestamp(this.db_request, {
        date: today.getDate(),
        month: today.getMonth(),
        year: today.getFullYear(),
      });

      res.send(
        this.stringHtml(
          authData?.data?.username ? authData.data.username : "guest",
          this.db_visitor.length,
          this.db.length,
          this.db_request.length,
          requestsToday.length,
          this.settings.Features,
          this.settings.Active,
          this.settings.Error,
          typeof authData?.data?.usage?.touched === "number"
            ? authData.data.usage.touched
            : "Please Login",
          typeList,
          "profile",
          authData?.data?.auth ? authData.data.auth : "",
          changelogContent,
          authData?.data?.email ? authData.data.email : "guest@yanz.id",
          {
            ...authData?.data,
            message: message,
            status: updateResult.status,
            notifStatus: isNotificationDisplayed,
          }
        )
      );
    });

    app.post("/action/delete", (req, res) => {
      const clientIP =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const sanitizedIP = clientIP.replace(/:|f|::1/g, "");

      this.addVisitor(sanitizedIP);

      const { username, auth } = req.body;
      const userIndex = this.db.findIndex((user) => user.username === username);

      if (userIndex === -1) {
        if (!auth) {
          res.sendFile(path.join(__dirname, "pages/login.html"));
        } else {
          res.sendStatus(404); // Not found
        }
        return;
      }

      if (!auth) {
        res.sendFile(path.join(__dirname, "pages/login.html"));
        return;
      }

      this.db.splice(userIndex, 1);
      this.forceReplaceClients(this.db);
      res.sendStatus(200); // Success
    });

    app.post("/action/edit", (req, res) => {
      const clientIP =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const sanitizedIP = clientIP.replace(/:|f|::1/g, "");

      this.addVisitor(sanitizedIP);
      const requestBody = req.body;

      const userIndex = this.db.findIndex(
        (user) => user.username === requestBody.oldusername
      );

      if (userIndex === -1) {
        if (!req.body.auth) {
          res.sendFile(path.join(__dirname, "pages/login.html"));
        } else {
          res.sendStatus(404);
        }
      } else {
        const updateResult = this.changeProfile(
          requestBody.oldusername,
          "manage",
          requestBody
        );

        if (!req.body.auth) {
          res.sendFile(path.join(__dirname, "pages/login.html"));
        } else if (updateResult.status) {
          this.db[updateResult.index] = updateResult.data;
          this.forceReplaceClients(this.db);
          res.sendStatus(200);
        } else {
          res.send("Error: " + updateResult.message);
        }
      }
    });

    app.post("/action/add", (req, res) => {
      const clientIP =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const sanitizedIP = clientIP.replace(/:|f|::1/g, "");

      this.addVisitor(sanitizedIP);
      const requestBody = req.body;

      const updateResult = this.changeProfile(
        requestBody.username,
        "manage",
        requestBody
      );

      const {
        status,
        username,
        password1,
        password2,
        email,
        phone,
        expired_on,
      } = requestBody;

      const registrationResult = this.requestRegister(
        username,
        password1,
        password2,
        email,
        phone,
        sanitizedIP,
        status,
        expired_on
      );

      if (!req.body.auth) {
        res.sendFile(path.join(__dirname, "pages/login.html"));
      } else {
        if (registrationResult.status) {
          this.db[updateResult.index] = updateResult.data;
          this.forceReplaceClients(this.db);
          res.sendStatus(200);
        } else {
          res.send("Error: " + registrationResult.message);
        }
      }
    });

    app.get("/pp", (req, res) => {
      res.sendFile(__dirname + "/pages/up.html");
    });

    app.post("/action/changePP", upload.single("avatar"), (req, res, next) => {
      try {
        let clientIP =
          req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        clientIP = clientIP.replace(/:|f|::1/g, "");

        this.addVisitor(clientIP);

        const requestBody = { ...req.body };
        const userIndex = this.db.findIndex(
          (user) => user.auth === requestBody.auth
        );

        if (userIndex === -1) {
          fs.unlinkSync(req.file.path);
          return res.sendFile(path.join(__dirname, "pages/invalid.html"));
        }

        const userData = this.getDataFromAuth(req.body.auth);

        if (!/image\/*/g.test(req.file.mimetype)) {
          fs.unlinkSync(req.file.path);
          res.send(
            this.stringHtml(
              userData?.data?.username || "guest",
              this.db_visitor.length,
              this.db.length,
              this.db_request.length,
              0,
              this.settings.Features,
              this.settings.Active,
              this.settings.Error,
              "Only images are allowed",
              undefined,
              "blank",
              req.body.auth,
              undefined,
              userData?.data?.email || "guest@yanz.id",
              {
                ...userData?.data,
                message: "Only images are allowed",
                status: false,
                notifStatus: true,
              }
            )
          );
          return;
        }

        if (userData?.data?.username !== req.body.username) {
          return res.sendFile(path.join(__dirname, "pages/invalidauth.html"));
        }

        if (fs.existsSync(__dirname + "/uploads" + req.file.filename)) {
          fs.unlinkSync(__dirname + "/uploads" + req.file.filename);
          return res.sendStatus(400);
        }

        this.db[userData.userindex].image = "/uploads/" + req.file.filename;
        this.forceReplaceClients(this.db);

        this.sendLogs("page", {
          page: "/profile",
          ip: clientIP,
        });

        if (!req.body.auth) {
          fs.unlinkSync(req.file.path);
          const cardList = this.typeListGenerate(this.scheme);
          const currentDate = new Date();
          const requestsToday = this.filterByTimestamp(this.db_request, {
            date: currentDate.getDate(),
            month: currentDate.getMonth(),
            year: currentDate.getFullYear(),
          });

          res.send(
            this.stringHtml(
              "guest",
              this.db_visitor.length,
              this.db.length,
              this.db_request.length,
              requestsToday.length,
              this.settings.Features,
              this.settings.Active,
              this.settings.Error,
              "Please Login",
              cardList,
              "profile",
              undefined,
              undefined,
              "guest@yanz.id",
              {}
            )
          );
        } else {
          const updatedUserData = this.getDataFromAuth(req.body.auth);
          const cardList = this.typeListGenerate(this.scheme, req.body.auth);
          const currentDate = new Date();
          const requestsToday = this.filterByTimestamp(this.db_request, {
            date: currentDate.getDate(),
            month: currentDate.getMonth(),
            year: currentDate.getFullYear(),
          });

          res.send(
            this.stringHtml(
              updatedUserData?.data?.username || "guest",
              this.db_visitor.length,
              this.db.length,
              this.db_request.length,
              requestsToday.length,
              this.settings.Features,
              this.settings.Active,
              this.settings.Error,
              typeof updatedUserData?.data?.usage?.touched === "number"
                ? updatedUserData.data.usage.touched
                : "Please Login",
              cardList,
              "profile",
              req.body.auth,
              undefined,
              updatedUserData?.data?.email || "guest@yanz.id",
              updatedUserData?.data
            )
          );
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });

    for (const route of this.scheme) {
      app.get(route.url, (req, res) => {
        let clientIP =
          req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        clientIP = clientIP.replace(/:|f|::1/g, "");

        this.addVisitor(clientIP);

        this.sendLogs("page", {
          page: route.url,
          ip: clientIP,
        });

        if (!req.query.auth) {
          const cardList = this.cardListGenerate(route.card);
          const typeList = this.typeListGenerate(this.scheme);

          res.send(
            this.htmlCard(cardList, typeList, undefined, route.title, {
              username: "Guest",
              email: "guest@yanz.id",
              message: "Invalid Authentication",
              status: false,
              notifStatus: true,
            })
          );
        } else {
          const userData = this.getDataFromAuth(req.query.auth);
          const cardList = this.cardListGenerate(route.card, req.query.auth);
          const typeList = this.typeListGenerate(this.scheme, req.query.auth);

          res.send(
            this.htmlCard(
              cardList,
              typeList,
              req.query.auth,
              route.title,
              userData.data
            )
          );
        }
      });
    }

    app.use(function (req, res, next) {
      res.status(404);
      res.sendFile(path.join(__dirname, "pages/404.html"));
    });

    const server = app.listen(this.port, () =>
      console.log("Started at port " + this.port)
    );

    server.on("upgrade", (request, socket, head) => {
      wsServer.handleUpgrade(request, socket, head, (webSocket) => {
        wsServer.emit("connection", webSocket, request);
      });
    });
  }
  getDataFromAuth(authToken) {
    const userIndex = this.db.findIndex((user) => user.auth == authToken);
    return userIndex === -1
      ? {
          status: false,
          message: "Invalid auth",
        }
      : {
          status: true,
          userindex: userIndex,
          data: this.db[userIndex],
        };
  }

  getDataFromApikey(apiKey) {
    const userIndex = this.db.findIndex((user) => user.apikey == apiKey);
    return userIndex === -1
      ? {
          status: false,
          message: "Invalid apikey",
        }
      : {
          status: true,
          userindex: userIndex,
          data: this.db[userIndex],
        };
  }

  getDataFromEmail(email) {
    const userIndex = this.db.findIndex((user) => user.email == email);
    return userIndex === -1
      ? {
          status: false,
          message: "Data not found",
        }
      : {
          status: true,
          userindex: userIndex,
          data: this.db[userIndex],
        };
  }

  generate_token(length) {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(
        ""
      );
    const token = [];
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token.push(characters[randomIndex]);
    }
    return token.join("");
  }

  reduceApikey(apiKey) {
    const userIndex = this.db.findIndex((user) => user.apikey == apiKey);
    if (userIndex === -1) {
      return {
        status: false,
        message: "Invalid Apikey",
      };
    } else {
      if (this.db[userIndex].status) {
        if (
          this.db[userIndex].usage.touched >= this.db[userIndex].usage.limit &&
          this.db[userIndex].usage.limit !== null
        ) {
          return {
            status: false,
            message: "You have exceeded the limit, comeback tomorrow",
          };
        }
        this.db[userIndex].usage.touched += 1;
        this.db[userIndex].usage.total += 1;
        fs.writeFileSync(
          "./lib/database/clients.json",
          JSON.stringify(this.db, null, 5)
        );
        return {
          status: true,
          remaining:
            this.db[userIndex].account_type === "premium" ||
            this.db[userIndex].account_type === "admin"
              ? "∞"
              : this.db[userIndex].usage.limit -
                this.db[userIndex].usage.touched,
        };
      } else {
        return {
          status: false,
          message:
            "Your account is disabled or email not yet verified, please contact owner wa.me/62855590321",
        };
      }
    }
  }

  resetLimit() {
    let clients = JSON.parse(fs.readFileSync("./lib/database/clients.json"));
    for (let client in clients) {
      if (clients[client].account_type === "free") {
        clients[client].usage.touched = 0;
      }
    }
    fs.writeFileSync(
      "./lib/database/clients.json",
      JSON.stringify(clients, null, 5)
    );
  }

  filterByTimestamp(data, filterCriteria) {
    return data.filter((entry) => {
      const timestampDate = new Date(entry.timestamp);
      const conditions = [
        filterCriteria.month === undefined ||
          timestampDate.getMonth() === filterCriteria.month,
        filterCriteria.date === undefined ||
          timestampDate.getDate() === filterCriteria.date,
        filterCriteria.year === undefined ||
          timestampDate.getFullYear() === filterCriteria.year,
      ];
      return conditions.every((condition) => condition);
    });
  }

  forceReplaceClients(clients) {
    fs.writeFileSync(
      "./lib/database/clients.json",
      JSON.stringify(clients, null, 5)
    );
  }

  requestRegister(
    username,
    password1,
    password2,
    email,
    phone,
    ip,
    status = "false",
    expirationDate
  ) {
    const existingUserIndex = this.db.findIndex(
      (user) => user.username === username
    );
    const ipAddresses = this.db.map((user) => user.last_ip);
    if (existingUserIndex !== -1) {
      return {
        status: false,
        message: "This user has been registered, please login",
      };
    } else {
      if (ipAddresses.length > 3) {
        return {
          status: false,
          message: "This IP has been login on 3 accounts",
        };
      } else {
        if (
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            email
          )
        ) {
          phone = phone.replace(/\D/g, "");
          password1 = password1.replace(/ /g, "");
          if (password1.length < 8) {
            return {
              status: false,
              message: "Password Must Be More Than 8 Letters",
            };
          }
          if (password1 !== password2) {
            return {
              status: false,
              message: "Password does not match",
            };
          } else {
            const usedEmails = this.db.map((user) => user.email);
            if (usedEmails.includes(email)) {
              return {
                status: false,
                message: "This email has been used",
              };
            }
            const avatarUrls = [
              "https://i.pinimg.com/236x/42/50/c5/4250c52757e3fb1eef27a8586563a76f.jpg",
              "https://i.pinimg.com/236x/04/a8/dd/04a8dd19ed28298c6fa9c5d38455ba0c.jpg",
              // Add other URLs as needed
            ];
            this.db.push({
              status,
              username,
              password: password1,
              email,
              phone,
              image: avatarUrls[Math.floor(Math.random() * avatarUrls.length)],
              last_ip: ip,
              auth: null,
              apikey: this.generate_token(20),
              expired_on: expirationDate || null,
              account_type: "free",
              usage: {
                total: 0,
                touched: 0,
                limit: 50,
              },
              allIP: [],
            });
            return {
              status: true,
              message: "Check Your Email",
              data: {
                username,
                password1,
                email,
                phone,
              },
            };
          }
        } else {
          return {
            status: false,
            message: "Please input a valid email",
          };
        }
      }
    }
  }

  pushIpDb(ip, username) {
    const userIndex = this.db.findIndex((user) => user.username === username);
    if (userIndex === -1) {
      return {
        status: false,
        message: "Username not registered",
      };
    } else if (!this.db[userIndex].allIP.includes(ip)) {
      this.db[userIndex].allIP.push(ip);
    }
  }

  requestLogin(username, password) {
    const userIndex = this.db.findIndex((user) => user.username == username);
    return userIndex === -1
      ? {
          status: false,
          message: "Username not registered",
        }
      : this.db[userIndex].password !== password
      ? {
          status: false,
          message: "Password invalid",
        }
      : {
          status: true,
          data: this.db[userIndex],
        };
  }

  changeProfile(
    username,
    type = "useremail" || "password" || "apikey" || "manage",
    data = {}
  ) {
    const userIndex = this.db.findIndex((user) => user.username == username);
    if (userIndex === -1) {
      return {
        status: false,
        message: "Username not registered",
      };
    } else {
      if (type === "useremail") {
        this.db[userIndex].username = data.username;
        this.db[userIndex].email = data.email;
        return {
          status: true,
          index: userIndex,
          data: this.db[userIndex],
        };
      } else if (type === "password") {
        if (data.newpassword !== data.confirmnewpassword) {
          return {
            status: false,
            message: "Password does not match",
          };
        } else if (this.db[userIndex].password !== data.oldpassword) {
          return {
            status: false,
            message: "Wrong old password",
          };
        }
        this.db[userIndex].password = data.newpassword;
        return {
          status: true,
          index: userIndex,
          data: this.db[userIndex],
        };
      } else if (type === "apikey") {
        this.db[userIndex].apikey = data.apikey;
        return {
          status: true,
          index: userIndex,
          data: this.db[userIndex],
        };
      } else if (type === "manage") {
        const existingUserIndex = this.db.findIndex(
          (user) => user.username == data.username
        );
        if (
          existingUserIndex !== -1 &&
          this.db[userIndex].username !== data.username
        ) {
          return {
            status: false,
            message: "Someone have this username",
          };
        }
        if (data.account_type === "free") {
          this.db[userIndex].status = data.status;
          this.db[userIndex].username = data.username;
          this.db[userIndex].password = data.password;
          this.db[userIndex].phone = data.phone;
          this.db[userIndex].email = data.email;
          this.db[userIndex].apikey = data.apikey;
          this.db[userIndex].account_type = "free";
          this.db[userIndex].expired_on = null;
          this.db[userIndex].usage.limit = 50;
        } else {
          this.db[userIndex].status = data.status;
          this.db[userIndex].username = data.username;
          this.db[userIndex].password = data.password;
          this.db[userIndex].phone = data.phone;
          this.db[userIndex].email = data.email;
          this.db[userIndex].apikey = data.apikey;
          this.db[userIndex].account_type = data.account_type;
          this.db[userIndex].expired_on = data.expired_on;
          this.db[userIndex].usage.limit = null;
        }
        return {
          status: true,
          index: userIndex,
          data: this.db[userIndex],
        };
      } else {
        return {
          status: false,
          message: "Invalid Type",
        };
      }
    }
  }

  changelogListGenerate(changelogData) {
    let output = "";
    for (let i = 0; i < changelogData.length; i++) {
      let badgeColors = [
        "primary",
        "secondary",
        "success",
        "danger",
        "warning",
        "info",
      ];
      let badgeColor =
        badgeColors[Math.floor(Math.random() * badgeColors.length)];
      output += `
        <li ${i % 2 === 0 ? 'class="timeline-inverted"' : ""}>
          <div class="timeline-badge ${badgeColor}">
            <i class="tim-icons icon-refresh-02"></i>
          </div>
          <div class="timeline-panel">
            <div class="timeline-heading">
              <span class="badge badge-pill badge-${badgeColor}">${
        changelogData[i].time
      }</span>
            </div>
            <div class="timeline-body">
              <ul>
                ${changelogData[i].information
                  .map((info) => `<li>${info}</li>`)
                  .join("")}
              </ul>
            </div>
          </div>
        </li>`;
    }
    return output;
  }

  userTableGenerate(users, auth) {
    let tableRows = "";
    for (let i = 0; i < users.length; i++) {
      tableRows += `
        <tr id="${users[i].username}">
          <th scope="row">${i + 1}</th>
          <td class="text-center">
            <span class="badge ${
              users[i].status === "true" ? "badge-success" : "badge-danger"
            }" style="color: #27293d;">
              ${users[i].status === "true" ? "Active" : "Unactive"}
            </span>
          </td>
          <td>${users[i].username}</td>
          <td style="color: #00f2c3;" class="text-center">${
            users[i].last_ip ? users[i].last_ip : "-"
          }</td>
          <td>${users[i].apikey}</td>
          <td class="text-center">${users[i].usage.total}</td>
          <td class="text-center">${
            users[i].expired_on == null
              ? "Unlimited"
              : moment(users[i].expired_on).format("DD MMM YYYY")
          }</td>
          <td class="text-center">
            <span class="badge ${
              users[i].account_type === "free"
                ? "badge-warning"
                : "badge-success"
            }" style="color: #27293d;">
              ${users[i].account_type}
            </span>
          </td>
          <td class="text-center">
            <a type="button" class="text-warning btn-sm btn-icon" href="?auth=${auth}&username=${
        users[i].username
      }&apikey=${users[i].apikey}&phone=${users[i].phone}&status=${
        users[i].status
      }&expired_on=${users[i].expired_on}&password=${users[i].password}&email=${
        users[i].email
      }&account_type=${
        users[i].account_type
      }&action=edit" rel="nofollow" title="Edit">
              <i class="tim-icons icon-pencil"></i>
            </a>
            <a type="button" class="text-danger btn-sm btn-icon" href="?auth=${auth}&username=${
        users[i].username
      }&action=delete" rel="nofollow" title="Delete">
              <i class="tim-icons icon-simple-remove"></i>
            </a>
          </td>
        </tr>`;
    }
    return tableRows;
  }

  userTopGenerate(users) {
    if (users.length < 5) {
      let topList = "";
      for (let i = 0; i < users.length; i++) {
        topList += `
          <li class="list-group-item">
            <a>${i + 1}. </a>
            <a style="color: lime;">${users[i].username} </a>
            <a style="color: #814cff;">[${users[i].usage.total}]</a>
          </li>
        `;
      }
      return topList;
    } else {
      let topFiveList = "";
      for (let i = 0; i < 5; i++) {
        topFiveList += `
          <li class="list-group-item">
            <a>${i + 1}. </a>
            <a style="color: lime;">${users[i].username} </a>
            <a style="color: #814cff;">[${users[i].usage.total}]</a>
          </li>
        `;
      }
      return topFiveList;
    }
  }

  typeListGenerate(types, auth) {
    let listHTML = "";
    for (let i = 0; i < types.length; i++) {
      listHTML += `
        <li class="cardlistjs" id="${types[i].title.replace(/ /g, "_")}">
          <a onclick="changeToActive('${types[i].title.replace(/ /g, "_")}');" 
             href="${types[i].url + (auth ? "?auth=" + auth : "")}">
            <i class="${types[i].flaticon}"></i>
            <p>${types[i].title}</p>
          </a>
        </li>
      `;
    }
    listHTML += "<br><br><br><br><br><br><br><br><br>";
    return listHTML;
  }

  searchListGenerate(items, auth) {
    let tableRows = "";
    for (let i = 0; i < items.length; i++) {
      tableRows += `
        <tr>
          <td>${items[i].title}</td>
          <td style="color: #00f2c3;" class="text-center">${
            items[i].method
          }</td>
          <td>${items[i].description}</td>
          <td class="text-center">apikey</td>
          <td class="text-center">
            <span class="badge ${
              items[i].status ? "badge-success" : "badge-danger"
            }" style="color: #27293d;">
              ${items[i].status ? "Active" : "Error"}
            </span>
          </td>
          <td class="text-center">
            <a type="button" class="text-success btn-sm btn-icon" 
               href="${
                 items[i].url
               }" target="_blank" rel="nofollow" title="Try">
              <i class="tim-icons icon-triangle-right-17"></i>
            </a>
          </td>
        </tr>
      `;
    }
    return tableRows;
  }

  cardListGenerate(cards, auth) {
    let tableRows = "";
    let userData = {};
    if (auth) {
      userData = this.getDataFromAuth(auth);
    }
    for (let i = 0; i < cards.length; i++) {
      tableRows += `
        <tr>
          <td>${cards[i].title}</td>
          <td style="color: #00f2c3;" class="text-center">${
            cards[i].method
          }</td>
          <td>${cards[i].description}</td>
          <td class="text-center">apikey</td>
          <td class="text-center">
            <span class="badge ${
              cards[i].status ? "badge-success" : "badge-danger"
            }" style="color: #27293d;">
              ${cards[i].status ? "Active" : "Error"}
            </span>
          </td>
          <td class="text-center">
            <a type="button" class="text-success btn-sm btn-icon" 
               href="${
                 cards[i].url + (auth ? userData?.data?.apikey : "YOUR_APIKEY")
               }" 
               target="_blank" rel="nofollow" title="Try">
              <i class="tim-icons icon-triangle-right-17"></i>
            </a>
          </td>
        </tr>
      `;
    }
    return tableRows;
  }

  htmlCard = (cardContent, sidebarContent, auth, title, userData) => `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="description" content="A REST APIs website that provides a wide variety of features for developers.">
      <meta name="author" content="Yanz">
      <title>Yanz - REST APIs</title>
      <link rel="apple-touch-icon" sizes="57x57" href="icon/apple-icon-57x57.png">
      <link rel="apple-touch-icon" sizes="60x60" href="icon/apple-icon-60x60.png">
      <link rel="stylesheet" href="css/nucleo-icons.css">
      <link rel="stylesheet" href="css/black-dashboard.min.css">
      <link rel="stylesheet" href="css/style.css">
      <link rel="stylesheet" href="flaticon/css/uicons-regular-rounded.css">
      <link rel="stylesheet" href="fontawesome5/css/all.min.css">
  </head>
  
  <body class="dark-mode" data-background-color="dark">
      <div class="wrapper">
          <div class="sidebar">
              <div class="sidebar-wrapper card-round">
                  <div class="logo text-center">
                      <a href="/" class="simple-text logo-normal" style="font-size: large;">
                          Yanz APIs
                      </a>
                  </div>
                  <ul class="nav">
                      <li>
                          <a href="/dashboard${auth ? `?auth=${auth}` : ""}">
                              <i class="fi-rr-cookie"></i>
                              <p>Dashboard</p>
                          </a>
                      </li>
                      ${
                        userData?.account_type === "admin"
                          ? `
                      <li>
                          <a href="/admin${auth ? `?auth=${auth}` : ""}">
                              <i class="fi-rr-shield-plus"></i>
                              <p>Admin Page</p>
                          </a>
                      </li>
                      `
                          : ""
                      }
                      <li>
                          <a href="/pricing${auth ? `?auth=${auth}` : ""}">
                              <i class="fi-rr-money"></i>
                              <p>Pricing</p>
                          </a>
                      </li>
                      <li>
                          <a href="/changelog${auth ? `?auth=${auth}` : ""}">
                              <i class="fi-rr-refresh"></i>
                              <p>Changelog</p>
                          </a>
                      </li>
                      <hr>
                      ${sidebarContent}
                  </ul>
              </div>
          </div>
          <div class="main-panel">
              <nav class="navbar navbar-expand-lg navbar-absolute navbar-transparent">
                  <div class="container-fluid">
                      <div class="navbar-wrapper">
                          <a class="navbar-brand" id="name-act" href="#">${title}</a>
                      </div>
                      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation">
                          <span class="navbar-toggler-bar navbar-kebab"></span>
                      </button>
                      <div class="collapse navbar-collapse" id="navigation">
                          <ul class="navbar-nav ml-auto">
                              <li class="nav-item dropdown no-arrow">
                                  <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown">
                                      <div class="photo">
                                          <img src="${
                                            userData?.image ||
                                            "/uploads/default-avatar.png"
                                          }" alt="Profile Photo">
                                      </div>
                                  </a>
                                  <ul class="dropdown-menu dropdown-navbar">
                                      <li>
                                          <div class="user-box">
                                              <div class="avatar-lg"><img src="${
                                                userData?.image ||
                                                "/uploads/default-avatar.png"
                                              }" alt="Profile"></div>
                                              <div class="u-text">
                                                  <h4>${
                                                    userData?.username ||
                                                    "Guest"
                                                  }</h4>
                                                  <p>${
                                                    userData?.email ||
                                                    "guest@yanz.id"
                                                  }</p>
                                                  <a href="/profile${
                                                    auth ? `?auth=${auth}` : ""
                                                  }" class="btn btn-xs btn-primary btn-sm">View Profile</a>
                                              </div>
                                          </div>
                                      </li>
                                      <li><a class="dropdown-item" href="/login">${
                                        userData?.username ? "Logout" : "Login"
                                      }</a></li>
                                  </ul>
                              </li>
                          </ul>
                      </div>
                  </div>
              </nav>
              <div class="content">
                  <div class="row">
                      <div class="col-md-12">
                          <div class="card">
                              <div class="card-header">
                                  <h4 class="card-title">${title} Documentation</h4>
                              </div>
                              <div class="card-body">
                                  <div class="table-responsive">
                                      <table class="table">
                                          <thead>
                                              <tr>
                                                  <th>Feature</th>
                                                  <th>Method</th>
                                                  <th>Description</th>
                                                  <th>Parameter</th>
                                                  <th>Status</th>
                                                  <th>Actions</th>
                                              </tr>
                                          </thead>
                                          <tbody>
                                              ${cardContent}
                                          </tbody>
                                      </table>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <script src="js/core/jquery.min.js"></script>
      <script src="js/core/bootstrap.min.js"></script>
      <script src="js/plugins/perfect-scrollbar.jquery.min.js"></script>
  </body>
  
  </html>
  `;

  stringHtml = (
    username,
    visitorCount,
    userCount,
    totalRequests,
    requestsToday,
    featuresCount,
    activeFeatures,
    errorCount,
    userRequests,
    additionalMenuItems,
    currentPage,
    authToken,
    changelogContent,
    userEmail,
    userData
  ) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="A REST APIs website that provides a wide variety of features for developers.">
    <meta name="robots" content="archive, follow, imageindex, index, odp, snippet, translate">
    <meta name="author" content="Yanz">
    <title>Yanz - REST APIs</title>

    <!-- Open Graph Meta Tags -->
    <meta property="og:site_name" name="og:site_name" content="Yanz APIs">
    <meta property="og:title" name="og:title" content="Yanz - REST APIs">
    <meta property="og:url" name="og:url" content="https://api.yanz.id/">
    <meta property="og:image" name="og:image" content="icon/android-icon-192x192.png">
    <meta property="og:description" name="og:description" content="A REST APIs website that provides a wide variety of features for developers.">

    <!-- Icons -->
    <link rel="apple-touch-icon" sizes="57x57" href="icon/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="icon/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="icon/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="icon/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="icon/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="icon/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="icon/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="icon/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="icon/apple-icon-180x180.png">
    <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="192x192" href="icon/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="icon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="icon/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="icon/favicon-16x16.png">

    <!-- Theme Colors -->
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="icon/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">
    
    <!-- Canonical -->
    <link rel="canonical" href="https://api.yanz.id/">

    <!-- Stylesheets -->
    <link href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,600,700,800" rel="stylesheet" />
    <link rel="stylesheet" href="css/nucleo-icons.css">
    <link rel="stylesheet" href="fontawesome5/css/all.min.css">
    <link rel="stylesheet" href="flaticon/css/uicons-regular-rounded.css">
    <link rel="stylesheet" href="css/black-dashboard.min.css">
    <link rel="stylesheet" href="css/style.css">

    <!-- Scripts -->
    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script data-cfasync="false" src="cloudflare-static/email-decode.min.js"></script>
    <script src="js/core/jquery.min.js"></script>
    <script src="js/core/popper.min.js"></script>
    <script src="js/plugins/perfect-scrollbar.jquery.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
    <script src="js/script.js"></script>
    <script src="https://momentjs.com/downloads/moment.js"></script>

    <!-- Notification Handler -->
    <script type="text/javascript">
        setTimeout(() => {
            if (${userData?.notifStatus}) save(${userData?.status}, '${
    userData?.message
  }')
        }, 10)
    </script>

    <!-- URL Parameters Handler -->
    <script>
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const action = urlParams.get('action');

        setTimeout(() => {
            if (action == 'edit') {
                const username = urlParams.get('username');
                const password = urlParams.get('password');
                const status = urlParams.get('status');
                const email = urlParams.get('email');
                const apikey = urlParams.get('apikey');
                const account_type = urlParams.get('account_type');
                const expired_on = urlParams.get('expired_on');
                const phone = urlParams.get('phone');
                const oldusername = urlParams.get('username');
                editModal(phone, status, username, email, password, account_type, apikey, expired_on, 
                         '${
                           authToken
                             ? authToken
                             : userData?.auth
                             ? userData?.auth
                             : ""
                         }', 'edit', 
                         { oldusername: oldusername });
            } else if (action == 'delete') {
                const username = urlParams.get('username');
                deleteConfirm(username, '${
                  authToken ? authToken : userData?.auth ? userData?.auth : ""
                }');
            } else if (action == 'add') {
                editModal('', '', '', '', '', '', '', 
                         '${
                           authToken
                             ? authToken
                             : userData?.auth
                             ? userData?.auth
                             : ""
                         }', 
                         urlParams.get('auth'), 'add');
            } else if (action == 'verify') {
                verify(urlParams.get('auth'));
            }
        }, 10);
    </script>
</head>

${
  currentPage === "blank"
    ? '<body class="dark-mode" data-background-color="dark"></body>'
    : `<body class="dark-mode" data-background-color="dark">
        <div class="wrapper">
            <!-- Sidebar -->
            <div class="sidebar">
                <div class="sidebar-wrapper card-round">
                    <div class="logo text-center">
                        <a href="/" class="simple-text logo-normal" style="font-size: large;">
                            Yanz API
                        </a>
                    </div>
                    <ul class="nav">
                        <li${
                          currentPage === "dashboard" ? ' class="active"' : ""
                        }>
                            <a href="/dashboard${
                              authToken ? "?auth=" + authToken : ""
                            }">
                                <i class="fi-rr-cookie"></i>
                                <p>Dashboard</p>
                            </a>
                        </li>
                        ${
                          userData?.account_type === "admin"
                            ? `
                        <li${currentPage === "admin" ? ' class="active"' : ""}>
                            <a href="/admin${
                              authToken ? "?auth=" + authToken : ""
                            }">
                                <i class="fi-rr-shield-plus"></i>
                                <p>Admin Page</p>
                            </a>
                        </li>
                        `
                            : ""
                        }
                        <li${
                          currentPage === "pricing" ? ' class="active"' : ""
                        }>
                            <a href="/pricing${
                              authToken ? "?auth=" + authToken : ""
                            }">
                                <i class="fi-rr-money"></i>
                                <p>Pricing</p>
                            </a>
                        </li>
                        <li${
                          currentPage === "changelog" ? ' class="active"' : ""
                        }>
                            <a href="/changelog${
                              authToken ? "?auth=" + authToken : ""
                            }">
                                <i class="fi-rr-refresh"></i>
                                <p>Changelog</p>
                            </a>
                        </li>
                        <hr>
                        ${additionalMenuItems}
                    </ul>
                </div>
            </div>

            <div class="main-panel">
                <!-- Navbar -->
                <nav class="navbar navbar-expand-lg navbar-absolute navbar-transparent">
                    <div class="container-fluid">
                        <div class="navbar-wrapper">
                            <div class="navbar-toggle d-inline">
                                <button type="button" class="navbar-toggler">
                                    <span class="navbar-toggler-bar bar1"></span>
                                    <span class="navbar-toggler-bar bar2"></span>
                                    <span class="navbar-toggler-bar bar3"></span>
                                </button>
                            </div>
                            <a class="navbar-brand" href="#">
                                ${
                                  currentPage
                                    ? currentPage.charAt(0).toUpperCase() +
                                      currentPage.slice(1)
                                    : "Yanz API"
                                }
                            </a>
                        </div>

                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation" 
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-bar navbar-kebab"></span>
                            <span class="navbar-toggler-bar navbar-kebab"></span>
                            <span class="navbar-toggler-bar navbar-kebab"></span>
                        </button>

                        <div class="collapse navbar-collapse" id="navigation">
                            <ul class="navbar-nav ml-auto">
                                <!-- Search -->
                                <li class="nav-item dropdown no-arrow">
                                    <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="tim-icons icon-zoom-split"></i>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right dropdown-search p-3 shadow animated--grow-in dark-color"
                                         aria-labelledby="searchDropdown" style="border: none;">
                                        <form class="navbar-search" action="/search?auth=${authToken}" method="GET">
                                            <div class="input-group">
                                                <div class="input-group-prepend">
                                                    <input type="hidden" name="auth" value="${authToken}">
                                                    <button class="input-group-text" type="submit">
                                                        <i class="tim-icons icon-zoom-split"></i>
                                                    </button>
                                                </div>
                                                <input type="text" class="form-control" name="q" placeholder="Search"
                                                       autocomplete="off" required>
                                            </div>
                                        </form>
                                    </div>
                                </li>

                                <!-- User Profile -->
                                <li class="dropdown nav-item">
                                    <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown">
                                        <div style="color: white;"  class="photo">
                                            <img src="${
                                              userData?.image ||
                                              "/uploads/default-avatar.png"
                                            }"
                                                 alt="Profile Photo">
                                        </div>
                                        <b class="caret d-none d-lg-block d-xl-block"></b>
                                        <p class="d-lg-none">${username}</p>
                                    </a>
                                    <ul class="dropdown-menu dropdown-navbar dropdown-user">
                                        <div class="dropdown-user-scroll scrollbar-outer">
                                            <li>
                                                <div class="user-box">
                                                    <div class="avatar-lg">
                                                        <img src="${
                                                          userData?.image ||
                                                          "/uploads/default-avatar.png"
                                                        }"
                                                             alt="image profile"
                                                             style="width: 100px; height: 70px; object-fit: cover;"
                                                             class="avatar-img rounded">
                                                    </div>
                                                    <div class="u-text">
                                                        <h4>${username}</h4>
                                                        <p class="text-muted">${
                                                          userData?.email ||
                                                          "guest@gmail.com"
                                                        }</p>
                                                        <a href="/profile${
                                                          authToken
                                                            ? "?auth=" +
                                                              authToken
                                                            : ""
                                                        }"
                                                           class="btn btn-xs btn-primary btn-sm">View Profile</a>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="dropdown-divider"></div>
                                                <a class="dropdown-item" href="/login">
                                                    ${
                                                      username !== "guest"
                                                        ? "Logout"
                                                        : "Login"
                                                    }
                                                </a>
                                            </li>
                                        </div>
                                    </ul>
                                </li>
                                <li class="separator d-lg-none"></li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <!-- Main Content -->
                <div class="content">
                    ${(() => {
                      switch (currentPage) {
                        case "dashboard":
                          return `
                                    <!-- Dashboard Stats -->
                                    <div class="row row-card-no-pd mt--2">
                                        <!-- Visitor Card -->
                                        <div class="col-sm-6 col-md-3">
                                            <div class="card card-stats card-round">
                                                <div class="card-body">
                                                    <div class="row">
                                                        <div class="col-5">
                                                            <div class="icon-big text-center">
                                                                <i class="fi-rr-eye text-primary"></i>
                                                            </div>
                                                        </div>
                                                        <div class="col-7 col-stats">
                                                            <div class="numbers">
                                                                <p class="card-category">Visitor</p>
                                                                <h4 class="card-title" id="visitor">${visitorCount}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- User Card -->
                                        <div class="col-sm-6 col-md-3">
                                            <div class="card card-stats card-round">
                                                <div class="card-body">
                                                    <div class="row">
                                                        <div class="col-5">
                                                            <div class="icon-big text-center">
                                                                <i class="fi-rr-user text-danger"></i>
                                                            </div>
                                                        </div>
                                                        <div class="col-7 col-stats">
                                                            <div class="numbers">
                                                                <p class="card-category">User</p>
                                                                <h4 class="card-title" id="user">${userCount}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Requests Card -->
                                        <div class="col-sm-6 col-md-3">
                                            <div class="card card-stats card-round">
                                                <div class="card-body">
                                                    <div class="row">
                                                        <div class="col-5">
                                                            <div class="icon-big text-center">
                                                                <i class="fi-rr-shopping-cart text-success"></i>
                                                            </div>
                                                        </div>
                                                        <div class="col-7 col-stats">
                                                            <div class="numbers">
                                                                <p class="card-category">Requests</p>
                                                                <h4 class="card-title" id="requests">${totalRequests}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Today's Requests Card -->
                                        <div class="col-sm-6 col-md-3">
                                            <div class="card card-stats card-round">
                                                <div class="card-body">
                                                    <div class="row">
                                                        <div class="col-5">
                                                            <div class="icon-big text-center">
                                                                <i class="fi-rr-time-twenty-four text-warning"></i>
                                                            </div>
                                                        </div>
                                                        <div class="col-7 col-stats">
                                                            <div class="numbers">
                                                                <p class="card-category">Today</p>
                                                                <h4 class="card-title" id="requests_today">${requestsToday}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Second Row Stats -->
                                    <div class="row row-card-no-pd mt--2">
                                        <!-- Features Card -->
                                        <div class="col-sm-6 col-md-3">
                                            <div class="card card-stats card-round">
                                                <div class="card-body">
                                                    <div class="row">
                                                        <div class="col-5">
                                                            <div class="icon-big text-center">
                                                                <i class="fi-rr-settings-sliders text-warning"></i>
                                                            </div>
                                                        </div>
                                                        <div class="col-7 col-stats">
                                                            <div class="numbers">
                                                                <p class="card-category">Features</p>
                                                                <h4 class="card-title">${featuresCount}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Active Features Card -->
                                        <div class="col-sm-6 col-md-3">
                                            <div class="card card-stats card-round">
                                                <div class="card-body">
                                                    <div class="row">
                                                        <div class="col-5">
                                                            <div class="icon-big text-center">
                                                                <i class="fi-rr-check text-success"></i>
                                                            </div>
                                                        </div>
                                                        <div class="col-7 col-stats">
                                                            <div class="numbers">
                                                                <p class="card-category">Active</p>
                                                                <h4 class="card-title">${activeFeatures}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Error Card -->
                                        <div class="col-sm-6 col-md-3">
                                            <div class="card card-stats card-round">
                                                <div class="card-body">
                                                    <div class="row">
                                                        <div class="col-5">
                                                            <div class="icon-big text-center">
                                                                <i class="fi-rr-cross-circle text-danger"></i>
                                                            </div>
                                                        </div>
                                                        <div class="col-7 col-stats">
                                                            <div class="numbers">
                                                                <p class="card-category">Error</p>
                                                                <h4 class="card-title">${errorCount}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- User Request Card -->
                                        <div class="col-sm-6 col-md-3">
                                            <div class="card card-stats card-round">
                                                <div class="card-body">
                                                    <div class="row">
                                                        <div class="col-5">
                                                            <div class="icon-big text-center">
                                                                <i class="fi-rr-time-twenty-four text-warning"></i>
                                                            </div>
                                                        </div>
                                                        <div class="col-7 col-stats">
                                                            <div class="numbers">
                                                                <p class="card-category">User Request</p>
                                                                <h4 class="card-title" id="requests_today">${userRequests}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Terms & Conditions -->
                                    <div class="row mt--2">
                                        <div class="col-sm-12 col-md-12">
                                            <div class="card card-stats card-round">
                                                <div class="card-header">
                                                    <h3 style="margin-bottom: 0;"><i class="fas fa-ruler text-danger"></i> S&K</h3>
                                                </div>
                                                <div class="card-body mb-3">
                                                    <ol>
                                                        <li>Jangan Spam Request</li>
                                                        <li>Gunakan Data ini Dengan Benar</li>
                                                        <li>Dilarang Menyebarkan Api</li>
                                                        <li>Jangan Ditembak</li>
                                                        <li>Owner Tidak Bertanggung Jawab Atas Apa Yang Anda Lakukan Kepada Website Ini</li>
                                                    </ol>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Thanks To & Contact Section -->
                                    <div class="row mt--2">
                                        <!-- Thanks To -->
                                        <div class="col-sm-12 col-md-6">
                                            <div class="card card-stats card-round">
                                                <div class="card-header">
                                                    <h3 style="margin-bottom: 0;"><i class="fal fa-sparkles text-success"></i> Thanks To</h3>
                                                </div>
                                                <div class="card-body mb-2">
                                                    <ul>
                                                        <li>LolHuman ( Template )</li>
                                                        <li>MRTHZ ( Website )</li>
                                                        <li>Pudidi ( Database + Scraping )</li>
                                                        <li>Dan Semua Orang Yang Mendukung Saya</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Contact Me -->
                                        <div class="col-sm-12 col-md-6">
                                            <div class="card card-stats card-round">
                                                <div class="card-header">
                                                    <h3 style="margin-bottom: 0;"><i class="fi-rr-headset text-warning"></i> Contact Me</h3>
                                                </div>
                                                <div class="card-body mb-2">
                                                    <p>Hello, Everyone!</p>
                                                    <ul>
                                                        <li>Interested in buying Premium or VIP?</li>
                                                        <li>Found 1 or more bugs?</li>
                                                        <li>Request Features?</li>
                                                    </ul>
                                                    <p>You can contact me via </p>
                                                    <p>
                                                        <a href="https://wa.me/62895617056310" class="text-white">
                                                            <i class="fab fa-whatsapp"></i> WhatsApp
                                                        </a>
                                                    </p>
                                                    <p>
                                                        <a href="https://www.instagram.com/iyanmikasa/" class="text-white">
                                                            <i class="fab fa-instagram"></i> Instagram
                                                        </a>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;

                        case "pricing":
                          return `
                                    <div class="row justify-content-center align-items-center">
                                        <!-- Premium Plan -->
                                        <div class="col-md-3 pl-md-0">
                                            <div class="card card-pricing card-pricing-focus card-secondary card-round">
                                                <div class="card-header">
                                                    <h4 class="card-title">Premium</h4>
                                                    <div class="card-price">
                                                        <span class="price">Rp. 10K</span>
                                                    </div>
                                                </div>
                                                <div class="card-body">
                                                    <ul class="specification-list">
                                                        <li>
                                                            <span class="name-specification">Requests</span>
                                                            <span class="status-specification">Unlimited</span>
                                                        </li>
                                                        <li>
                                                            <span class="name-specification">Custom Api Key</span>
                                                            <span class="status-specification">Yes</span>
                                                        </li>
                                                        <li>
                                                            <span class="name-specification">Premium Features</span>
                                                            <span class="status-specification">Yes</span>
                                                        </li>
                                                        <li>
                                                            <span class="name-specification">Expired</span>
                                                            <span class="status-specification">1 Month</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div class="card-footer">
                                                    <a class="btn btn btn-success btn-round text-white" href="https://wa.me/62895617056310">Order Now</a>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Free Plan -->
                                        <div class="col-md-3 pl-md-0 pr-md-0">
                                            <div class="card card-pricing card-round">
                                                <div class="card-header">
                                                    <h4 class="card-title">Free</h4>
                                                    <div class="card-price">
                                                        <span class="price">Rp. 0</span>
                                                    </div>
                                                </div>
                                                <div class="card-body">
                                                    <ul class="specification-list">
                                                        <li>
                                                            <span class="name-specification">Requests</span>
                                                            <span class="status-specification">25 / day</span>
                                                        </li>
                                                        <li>
                                                            <span class="name-specification">Custom Api Key</span>
                                                            <span class="status-specification">No</span>
                                                        </li>
                                                        <li>
                                                            <span class="name-specification">Premium Features</span>
                                                            <span class="status-specification">No</span>
                                                        </li>
                                                        <li>
                                                            <span class="name-specification">Expired</span>
                                                            <span class="status-specification">-</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div class="card-footer">
                                                    <a class="btn btn-primary btn-round text-white" href="/register">Register</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;

                        case "changelog":
                          return `
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="card card-timeline card-plain" style="background-color: transparent;">
                                                <div class="card-body">
                                                    <ul class="timeline" style="height: 100%;">
                                                        ${changelogContent}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;

                        case "profile":
                          return `
                                    <div class="row">
                                        <div class="col-md-8">
                                            <div class="card card-round">
                                                <!-- Profile Info -->
                                                <div class="card-header">
                                                    <h5 class="title">Profile</h5>
                                                </div>
                                                <div class="card-body">
                                                    <div class="row">
                                                        <div class="col-md-4 pr-md-1">
                                                            <div class="form-group">
                                                                <label>Username</label>
                                                                <p id="c-username">${username}</p>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-4 px-md-1">
                                                            <div class="form-group">
                                                                <label>Email</label>
                                                                <p id="c-email">${userEmail}</p>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-4 pl-md-1">
                                                            <div class="form-group">
                                                                <label>Api Key</label>
                                                                <p id="c-apikey">${
                                                                  username ===
                                                                  "guest"
                                                                    ? "None"
                                                                    : userData.apikey
                                                                }</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-4 pr-md-1">
                                                            <div class="form-group">
                                                                <label>Requests</label>
                                                                <p>${userRequests}</p>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-4 px-md-1">
                                                            <div class="form-group">
                                                                <label>Requests Today</label>
                                                                <p>${requestsToday}</p>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-4 px-md-1">
                                                            <div class="form-group">
                                                                <label>Expired On</label>
                                                                <p>${
                                                                  userData.account_type ===
                                                                  "premium"
                                                                    ? moment(
                                                                        userData.expired_on
                                                                      ).format(
                                                                        "DD MMMM YYYY"
                                                                      )
                                                                    : userData.account_type ===
                                                                      "admin"
                                                                    ? "Unlimited"
                                                                    : "None"
                                                                }</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Profile Edit Form -->
                                            <div class="card card-round">
                                                <div class="card-header">
                                                    <div class="row">
                                                        <div class="col-sm-6 text-left">
                                                            <h5 class="title">Edit Profile</h5>
                                                        </div>
                                                        <div class="col-sm-6">
                                                            <div class="btn-group btn-group-toggle float-right" data-toggle="buttons">
                                                                <label class="btn btn-sm btn-primary btn-simple active" id="0">
                                                                    <input type="radio" name="options" checked="">
                                                                    <span class="d-none d-sm-block d-md-block d-lg-block d-xl-block">Profile</span>
                                                                    <span class="d-block d-sm-none">
                                                                        <i class="tim-icons icon-single-02"></i>
                                                                    </span>
                                                                </label>
                                                                <label class="btn btn-sm btn-primary btn-simple" id="1">
                                                                    <input type="radio" class="d-none d-sm-none" name="options">
                                                                    <span class="d-none d-sm-block d-md-block d-lg-block d-xl-block">Password</span>
                                                                    <span class="d-block d-sm-none">
                                                                        <i class="fi-rr-password"></i>
                                                                    </span>
                                                                </label>
                                                                <label class="btn btn-sm btn-primary btn-simple" id="2">
                                                                    <input type="radio" class="d-none" name="options">
                                                                    <span class="d-none d-sm-block d-md-block d-lg-block d-xl-block">Api Key</span>
                                                                    <span class="d-block d-sm-none">
                                                                        <i class="fi-rr-flame"></i>
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- Username/Email Form -->
                                                <div class="card-body" id="usernameemail">
                                                    <form method="POST" action="/profile" class="changeprofile">
                                                        <div class="row">
                                                            <div class="col-md-6 pr-md-1">
                                                                <div class="form-group">
                                                                    <label>Username</label>
                                                                    <input type="text" class="form-control" name="newusername" placeholder="Username" value="${username}" 
                                                                    autocomplete="off" required="">
                                                                </div>
                                                            </div>
                                                            <div class="col-md-6 pl-md-1">
                                                                <div class="form-group">
                                                                    <label>Email</label>
                                                                    <input type="email" class="form-control" name="email"
                                                                          placeholder="Email" value="${userEmail}"
                                                                          autocomplete="off" required="">
                                                                </div>
                                                            </div>
                                                            <input type="hidden" name="auth" value="${
                                                              userData.auth
                                                            }">
                                                            <input type="hidden" name="username" value="${username}">
                                                            <input type="hidden" name="message" value="Successfully changed Username or Email">
                                                            <input type="text" name="type" value="useremail" style="display: none;">
                                                            <button type="submit" class="btn btn-fill btn-primary ml-3 inibutton">Save</button>
                                                        </div>
                                                    </form>
                                                </div>

                                                <!-- Password Form -->
                                                <div class="card-body" id="password" style="display: none;">
                                                    <form method="POST" action="/profile" class="changeprofile">
                                                        <div class="row">
                                                            <div class="col-md-4 pr-md-1">
                                                                <div class="form-group">
                                                                    <label>Old Password</label>
                                                                    <input type="password" class="form-control" name="oldpassword" 
                                                                          placeholder="Old Password" autocomplete="off" required="">
                                                                </div>
                                                            </div>
                                                            <div class="col-md-4 px-md-1">
                                                                <div class="form-group">
                                                                    <label>New Password</label>
                                                                    <input type="password" class="form-control" name="newpassword"
                                                                          placeholder="New Password" autocomplete="off" required="">
                                                                </div>
                                                            </div>
                                                            <div class="col-md-4 pl-md-1">
                                                                <div class="form-group">
                                                                    <label>Confirm New Password</label>
                                                                    <input type="password" class="form-control" name="confirmnewpassword"
                                                                          placeholder="Confirm New Password" autocomplete="off" required="">
                                                                </div>
                                                            </div>
                                                            <input type="hidden" name="auth" value="${
                                                              userData.auth
                                                            }">
                                                            <input type="hidden" name="username" value="${username}">
                                                            <input type="hidden" name="message" value="Successfully changed Password">
                                                            <input type="text" name="type" value="password" style="display: none;">
                                                            <button type="submit" class="btn btn-fill btn-primary ml-3 inibutton">Save</button>
                                                        </div>
                                                    </form>
                                                </div>

                                                <!-- API Key Form -->
                                                <div class="card-body" id="apikey" style="display: none;">
                                                    <form method="POST" action="/profile" class="changeprofiles">
                                                        ${
                                                          userData.account_type ==
                                                          "free"
                                                            ? `<div class="col-md-12 pr-md-1">
                                                                   <div class="form-group">
                                                                        <label>Your Apikey</label>
                                                                        <input type="apikey" value="${
                                                                          userData.apikey ===
                                                                          undefined
                                                                            ? "None"
                                                                            : userData.apikey
                                                                        }"
                                                                              class="form-control" name="apikey" autocomplete="off" readonly>
                                                                   </div>
                                                              </div>
                                                              <input type="text" name="changeprofile" value="apikey" style="display: none;">
                                                              <button type="submit" class="btn btn-fill btn-primary ml-3 inibutton" disabled="disabled">Save</button>`
                                                            : `<div class="col-md-12 pr-md-1">
                                                                   <div class="form-group">
                                                                        <label>Your Apikey</label>
                                                                        <input type="apikey" value="${
                                                                          userData.apikey ===
                                                                          undefined
                                                                            ? "None"
                                                                            : userData.apikey
                                                                        }"
                                                                              class="form-control" name="apikey" autocomplete="off" required="">
                                                                   </div>
                                                              </div>
                                                              <input type="hidden" name="auth" value="${
                                                                userData.auth
                                                              }">
                                                              <input type="hidden" name="message" value="Successfully changed Apikey">
                                                              <input type="hidden" name="username" value="${username}">
                                                              <input type="text" name="type" value="apikey" style="display: none;">
                                                              <button type="submit" class="btn btn-fill btn-primary ml-3 inibutton">Save</button>`
                                                        }
                                                    </form>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Profile Card -->
                                        <div class="col-md-4">
                                            <div class="card card-user card-round">
                                                <div class="card-body">
                                                    <div class="author">
                                                        <div class="block block-one"></div>
                                                        <div class="block block-two"></div>
                                                        <div class="block block-three"></div>
                                                        <div class="block block-four"></div>
                                                        <a href="#" id="changeAvatar">
                                                            <img class="avatar" id="c-avatar" style="object-fit: cover;"
                                                                 src="${
                                                                   userData?.image ||
                                                                   "/uploads/default-avatar.png"
                                                                 }"
                                                                 alt="...">
                                                            <h3 class="title" style="margin-bottom: 0;" id="c-tusername">${username}</h3>
                                                        </a>
                                                        <span class="badge badge-${
                                                          userData.status ==
                                                          "false"
                                                            ? "danger"
                                                            : "success"
                                                        }"
                                                              style="color: #27293d; margin-bottom: 20px">
                                                            ${
                                                              userData.status ==
                                                              "false"
                                                                ? "Unactive"
                                                                : "Active"
                                                            }
                                                        </span>
                                                        <p class="description">
                                                            ${
                                                              userData.account_type ==
                                                              "free"
                                                                ? "Free User"
                                                                : userData.account_type ==
                                                                  "premium"
                                                                ? "Premium User"
                                                                : userData.account_type ===
                                                                  undefined
                                                                ? "Guest"
                                                                : "Administrator"
                                                            }
                                                            <br> 
                                                            ${
                                                              userData.phone
                                                                ? userData.phone
                                                                : "-"
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;

                        case "search":
                          return `
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h4 class="card-title">Search ${userData.searchName} Documentation</h4>
                                                </div>
                                                <div class="card-body">
                                                    <div class="table-responsive ps">
                                                        <table class="table">
                                                            <thead class="text-primary">
                                                                <tr>
                                                                    <th>Feature</th>
                                                                    <th class="text-center">Method</th>
                                                                    <th>Description</th>
                                                                    <th class="text-center">Parameter</th>
                                                                    <th class="text-center">Status</th>
                                                                    <th class="text-center">Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                ${userData.cardSearchList}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;

                        default:
                          return "";
                      }
                    })()}
                </div>
            </div>
        </div>

        <!-- Core Scripts -->
        <script src="js/core/jquery.min.js"></script>
        <script src="js/core/popper.min.js"></script>
        <script src="js/core/bootstrap.min.js"></script>
        <script src="js/plugins/perfect-scrollbar.jquery.min.js"></script>
        <script src="js/plugins/bootstrap-notify.js"></script>
        <script src="js/black-dashboard.min.js"></script>
    </body>`
}

</html>`;
  strRegister = (message) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <style>
        body {
            margin: 0;
            color: #6a6f8c;
            font: 600 16px/18px 'Open Sans', sans-serif;
            background: linear-gradient(-45deg, #7c1e01, #8a0035, #0b6586, #00ac84);
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
        }

        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        *, :after, :before { box-sizing: border-box; }
        .clearfix:after, .clearfix:before { content: ''; display: table; }
        .clearfix:after { clear: both; display: block; }
        a { color: inherit; text-decoration: none; }
        
        .login-wrap {
            width: 100%;
            margin: auto;
            max-width: 525px;
            min-height: 670px;
            position: relative;
            background: url(https://raw.githubusercontent.com/khadkamhn/day-01-login-form/master/img/bg.jpg) no-repeat center;
            box-shadow: 0 12px 15px 0 rgba(0, 0, 0, .24), 0 17px 50px 0 rgba(0, 0, 0, .19);
        }

        .login-html {
            width: 100%;
            height: 100%;
            position: absolute;
            padding: 90px 70px 50px 70px;
            background: rgba(40, 57, 101, .9);
        }

        .login-html .tab, .login-form .group .label, .login-form .group .button {
            text-transform: uppercase;
        }

        .login-html .tab {
            font-size: 22px;
            margin-right: 15px;
            padding-bottom: 5px;
            display: inline-block;
            border-bottom: 2px solid transparent;
        }

        .login-html .sign-in:checked + .tab,
        .login-html .sign-up:checked + .tab {
            color: #fff;
            border-color: #1161ee;
        }

        .login-form {
            position: relative;
            perspective: 1000px;
            transform-style: preserve-3d;
        }

        .login-form .group {
            margin-bottom: 15px;
        }

        .login-form .group .label,
        .login-form .group .input,
        .login-form .group .button {
            width: 100%;
            color: #fff;
            display: block;
        }

        .login-form .group .input,
        .login-form .group .button {
            border: none;
            padding: 15px 20px;
            border-radius: 25px;
            background: rgba(255, 255, 255, .1);
        }

        .login-form .group input[data-type="password"] {
            text-security: circle;
            -webkit-text-security: circle;
        }

        .login-form .group .label {
            color: #aaa;
            font-size: 12px;
        }

        .login-form .group .button {
            background: #1161ee;
        }

        .hr {
            height: 2px;
            margin: 60px 0 50px 0;
            background: rgba(255, 255, 255, .2);
        }

        .foot-lnk {
            text-align: center;
        }

        .welcome {
            text-align: center;
            margin: 120px;
        }

        .text-white {
            color: #FFF;
        }
    </style>
    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        setTimeout(() => { Swal.fire({ icon: 'warning', title: 'Oops...', text: '${message}' }); }, 10);
    </script>
</head>
<body>
    <div class="login-wrap">
        <div class="login-html">
            <input id="tab-1" type="radio" name="tab" class="sign-in" checked>
            <label for="tab-1" class="tab">Sign In</label>
            <div class="login-form">
                <form action="/dashboard" method="POST">
                    <div class="group">
                        <label for="user" class="label">Username</label>
                        <input id="user" name="username" type="text" class="input">
                    </div>
                    <div class="group">
                        <label for="pass" class="label">Password</label>
                        <input id="pass" name="password" type="password" class="input">
                    </div>
                    <div class="group">
                        <input id="check" type="checkbox" class="check" checked>
                        <label for="check"><span class="icon"></span> Keep me Signed in</label>
                    </div>
                    <div class="group">
                        <input type="submit" class="button" value="Sign In">
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>
</html>`;
  strRegister = (message) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <style>
        body {
            margin: 0;
            color: #6a6f8c;
            font: 600 16px/18px 'Open Sans', sans-serif;
            background: linear-gradient(-45deg, #7c1e01, #8a0035, #0b6586, #00ac84);
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
        }

        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        *, :after, :before { box-sizing: border-box; }
        .clearfix:after, .clearfix:before { content: ''; display: table; }
        .clearfix:after { clear: both; display: block; }
        a { color: inherit; text-decoration: none; }
        
        .login-wrap {
            width: 100%;
            margin: auto;
            max-width: 525px;
            min-height: 670px;
            position: relative;
            background: url(https://raw.githubusercontent.com/khadkamhn/day-01-login-form/master/img/bg.jpg) no-repeat center;
            box-shadow: 0 12px 15px 0 rgba(0, 0, 0, .24), 0 17px 50px 0 rgba(0, 0, 0, .19);
        }

        .login-html {
            width: 100%;
            height: 100%;
            position: absolute;
            padding: 90px 70px 50px 70px;
            background: rgba(40, 57, 101, .9);
        }

        .login-html .tab, .login-form .group .label, .login-form .group .button {
            text-transform: uppercase;
        }

        .login-html .tab {
            font-size: 22px;
            margin-right: 15px;
            padding-bottom: 5px;
            display: inline-block;
            border-bottom: 2px solid transparent;
        }

        .login-html .sign-in:checked + .tab,
        .login-html .sign-up:checked + .tab {
            color: #fff;
            border-color: #1161ee;
        }

        .login-form {
            position: relative;
            perspective: 1000px;
            transform-style: preserve-3d;
        }

        .login-form .group {
            margin-bottom: 15px;
        }

        .login-form .group .label,
        .login-form .group .input,
        .login-form .group .button {
            width: 100%;
            color: #fff;
            display: block;
        }

        .login-form .group .input,
        .login-form .group .button {
            border: none;
            padding: 15px 20px;
            border-radius: 25px;
            background: rgba(255, 255, 255, .1);
        }

        .login-form .group input[data-type="password"] {
            text-security: circle;
            -webkit-text-security: circle;
        }

        .login-form .group .label {
            color: #aaa;
            font-size: 12px;
        }

        .login-form .group .button {
            background: #1161ee;
        }

        .hr {
            height: 2px;
            margin: 60px 0 50px 0;
            background: rgba(255, 255, 255, .2);
        }

        .foot-lnk {
            text-align: center;
        }

        .welcome {
            text-align: center;
            margin: 120px;
        }

        .text-white {
            color: #FFF;
        }
    </style>
    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        setTimeout(() => { Swal.fire({ icon: 'warning', title: 'Oops...', text: '${message}' }); }, 10);
    </script>
</head>
<body>
    <div class="login-wrap">
        <div class="login-html">
            <input id="tab-1" type="radio" name="tab" class="sign-in" checked>
            <label for="tab-1" class="tab">Sign In</label>
            <div class="login-form">
                <form action="/dashboard" method="POST">
                    <div class="group">
                        <label for="user" class="label">Username</label>
                        <input id="user" name="username" type="text" class="input">
                    </div>
                    <div class="group">
                        <label for="pass" class="label">Password</label>
                        <input id="pass" name="password" type="password" class="input">
                    </div>
                    <div class="group">
                        <input id="check" type="checkbox" class="check" checked>
                        <label for="check"><span class="icon"></span> Keep me Signed in</label>
                    </div>
                    <div class="group">
                        <input type="submit" class="button" value="Sign In">
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>
</html>`;

  verifyHtml = (data) => `
<!DOCTYPE html>
<html>
<head>
    <title>Email Verification</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
        @media screen {
            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
            }
            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
            }
        }

        body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #f4f4f4;
            font-family: 'Lato', Helvetica, Arial, sans-serif;
        }
        table {
            border-collapse: collapse !important;
        }
        a {
            color: inherit !important;
            text-decoration: none !important;
        }
    </style>
</head>
<body style="margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td bgcolor="#13005E" align="center">
                <h1 style="color: #ffffff;">Hi, ${data.username}</h1>
                <p style="color: #ffffff;">${
                  data.type === "email"
                    ? "Please confirm your account."
                    : "Reset your password using the link below."
                }</p>
            </td>
        </tr>
        <tr>
            <td bgcolor="#ffffff" align="center">
                <a href="${
                  data.url
                }" style="font-size: 18px; color: #ffffff; background-color: #13005E; padding: 15px 30px; text-decoration: none; border-radius: 5px;">
                    ${
                      data.type === "email"
                        ? "Confirm Account"
                        : "Reset Password"
                    }
                </a>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 20px;">
                <p>If you have any questions, feel free to reply to this email.</p>
                <p style="color: #13005E;">Cheers, <br> Yanz API Team</p>
            </td>
        </tr>
    </table>
</body>
</html>`;
}
module.exports = RestApi;
