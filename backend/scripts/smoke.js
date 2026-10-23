const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
let failures = 0;

function assertEqual(actual, expected, msg) {
  if (actual !== expected) {
    console.error(`FAIL: ${msg} (Expected: ${expected}, Actual: ${actual})`);
    failures++;
    return false;
  }
  console.log(`PASS: ${msg}`);
  return true;
}

function assertMatch(actual, regex, msg) {
  if (!regex.test(actual)) {
    console.error(`FAIL: ${msg} (Actual: ${actual} no encaja en ${regex})`);
    failures++;
    return false;
  }
  console.log(`PASS: ${msg}`);
  return true;
}

async function run() {
  try {
    let res = await fetch(`${BASE_URL}/api/health`);
    assertEqual(res.status, 200, "Health check status 200");
    let json = await res.json();
    assertEqual(json.service, "antilia-backend", "Health check service name");
    const email = `test${Date.now()}@example.com`;
    const pwd = "Password123";
    res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test User", email, password: pwd })
    });
    assertEqual(res.status, 201, "Register status 201");
    json = await res.json();
    if (json.user && json.user.password_hash) {
      console.error("FAIL: Register includes password_hash");
      failures++;
    } else {
      console.log("PASS: Register response no password_hash");
    }
    const token = json.token;
    res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test User", email, password: pwd })
    });
    assertEqual(res.status, 409, "Register duplicate email 409");
    res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pwd })
    });
    assertEqual(res.status, 200, "Login valid 200");
    
    res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: "WrongPassword1" })
    });
    assertEqual(res.status, 401, "Login invalid 401");
    const emailUntrimmedPwd = `test_untrimmed_${Date.now()}@example.com`;
    const pwdUntrimmed = " Prueba1234 ";
    res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test User 2", email: emailUntrimmedPwd, password: pwdUntrimmed })
    });
    assertEqual(res.status, 201, "Register with untrimmed password 201");

    res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailUntrimmedPwd, password: pwdUntrimmed })
    });
    assertEqual(res.status, 200, "Login with untrimmed password 200");
    const longBytesPwd = "a".repeat(80);
    res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailUntrimmedPwd, password: longBytesPwd })
    });
    assertEqual(res.status, 400, "Login with 80 bytes password 400");
    let jsonErr = await res.json();
    assertEqual(jsonErr.message || jsonErr.error, "La contraseña es demasiado larga (máximo 72 bytes).", "Login with 80 bytes password message");
    res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    assertEqual(res.status, 200, "Get /me valid token 200");
    
    res = await fetch(`${BASE_URL}/api/auth/me`);
    assertEqual(res.status, 401, "Get /me no token 401");
    res = await fetch(`${BASE_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ title: "Fisica 1", type: "fisica" })
    });
    assertEqual(res.status, 201, "Create task fisica 201");
    let taskFisica = await res.json();
    let taskFisicaId = taskFisica.task.id;

    res = await fetch(`${BASE_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ title: "Digital 1", type: "digital" })
    });
    assertEqual(res.status, 201, "Create task digital 201");
    res = await fetch(`${BASE_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ title: "Inv", type: "invalido" })
    });
    assertEqual(res.status, 400, "Create task invalido type 400");
    
    res = await fetch(`${BASE_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ title: 123, type: "fisica" })
    });
    assertEqual(res.status, 400, "Create task invalido title type 400");
    
    res = await fetch(`${BASE_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ title: "a".repeat(121), type: "fisica" })
    });
    assertEqual(res.status, 400, "Create task invalido title length 400");
    
    res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "1", email: 123, password: pwd })
    });
    assertEqual(res.status, 400, "Register email invalid type 400");
    res = await fetch(`${BASE_URL}/api/tasks?status=pendiente`, { headers: { "Authorization": `Bearer ${token}` }});
    json = await res.json();
    assertEqual(json.tasks.length, 2, "List pending tasks 2");

    res = await fetch(`${BASE_URL}/api/tasks?type=fisica`, { headers: { "Authorization": `Bearer ${token}` }});
    json = await res.json();
    assertEqual(json.tasks.length, 1, "List pending fisica 1");

    res = await fetch(`${BASE_URL}/api/tasks?status=all`, { headers: { "Authorization": `Bearer ${token}` }});
    json = await res.json();
    assertEqual(json.tasks.length, 2, "List all tasks 2");

    res = await fetch(`${BASE_URL}/api/tasks?status=completada`, { headers: { "Authorization": `Bearer ${token}` }});
    json = await res.json();
    assertEqual(json.tasks.length, 0, "List completada 0 before complete");

    res = await fetch(`${BASE_URL}/api/tasks?type=invalido`, { headers: { "Authorization": `Bearer ${token}` }});
    assertEqual(res.status, 400, "List invalido type 400");
    res = await fetch(`${BASE_URL}/api/tasks/${taskFisicaId}/complete`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` }
    });
    assertEqual(res.status, 200, "Complete task 200");
    json = await res.json();
    assertEqual(json.streak.current_streak, 1, "Streak current_streak = 1");

    res = await fetch(`${BASE_URL}/api/tasks?status=all`, { headers: { "Authorization": `Bearer ${token}` }});
    json = await res.json();
    assertEqual(json.tasks.length, 2, "List all tasks 2 after complete");

    res = await fetch(`${BASE_URL}/api/tasks/${taskFisicaId}/complete`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` }
    });
    assertEqual(res.status, 404, "Complete task again 404");
    
    res = await fetch(`${BASE_URL}/api/tasks/not-uuid/complete`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` }
    });
    assertEqual(res.status, 404, "Complete invalid UUID 404");
    res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{"
    });
    assertEqual(res.status, 400, "Malformed JSON 400");
    json = await res.json();
    assertEqual(json.error, "JSON inválido.", "Malformed JSON message");
    res = await fetch(`${BASE_URL}/api/inexistente`);
    assertEqual(res.status, 404, "API not found 404");
    json = await res.json();
    assertEqual(json.error, "Ruta no encontrada.", "API not found JSON");

  } catch (err) {
    console.error("FAIL: Error in script", err);
    failures++;
  }

  if (failures > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run();
