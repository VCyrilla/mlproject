import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// ==================== DATABASE INITIALIZATION ====================
// Create comprehensive database schema on server startup
async function initializeDatabase() {
  console.log('Initializing database schema...');
  
  // Initialize KV store with default data structures
  const tables = [
    'users',
    'file_analyses',
    'vulnerabilities',
    'analysis_actions',
    'cli_commands',
    'settings'
  ];
  
  for (const table of tables) {
    const existingData = await kv.get(`${table}:metadata`);
    if (!existingData) {
      await kv.set(`${table}:metadata`, {
        created_at: new Date().toISOString(),
        count: 0,
        indexes: []
      });
    }
  }
  
  console.log('Database schema initialized successfully');
}

// Initialize database on startup
initializeDatabase();

// ==================== AUTHENTICATION ROUTES ====================

// Sign up new user
app.post('/make-server-05e5e588/auth/signup', async (c) => {
  try {
    const { email, password, fullName, organization, role } = await c.req.json();
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: fullName, organization, role },
      // Automatically confirm email since email server is not configured
      email_confirm: true
    });
    
    if (error) {
      console.log(`Sign up error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }
    
    // Store additional user data in KV store
    const userId = data.user.id;
    await kv.set(`users:${userId}`, {
      id: userId,
      email,
      full_name: fullName,
      organization,
      role,
      created_at: new Date().toISOString(),
      total_analyses: 0,
      total_threats_detected: 0
    });
    
    // Update user count
    const metadata = await kv.get('users:metadata') || { count: 0 };
    await kv.set('users:metadata', { ...metadata, count: metadata.count + 1 });
    
    console.log(`User created successfully: ${email}`);
    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log(`Sign up error: ${error}`);
    return c.json({ error: 'Internal server error during sign up' }, 500);
  }
});

// Sign in user
app.post('/make-server-05e5e588/auth/signin', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.log(`Sign in error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }
    
    // Retrieve user data
    const userData = await kv.get(`users:${data.user.id}`);
    
    return c.json({ 
      success: true, 
      session: data.session,
      user: userData 
    });
  } catch (error) {
    console.log(`Sign in error: ${error}`);
    return c.json({ error: 'Internal server error during sign in' }, 500);
  }
});

// Get current user session
app.get('/make-server-05e5e588/auth/session', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Invalid session' }, 401);
    }
    
    const userData = await kv.get(`users:${user.id}`);
    return c.json({ user: userData });
  } catch (error) {
    console.log(`Session error: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ==================== FILE ANALYSIS ROUTES ====================

// Upload and analyze file
app.post('/make-server-05e5e588/analysis/upload', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken!);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { fileName, fileSize, fileHash, fileType } = await c.req.json();
    
    // Create new analysis record
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // Simulate ML analysis with realistic threat scoring
    const threatScore = Math.floor(Math.random() * 100);
    const status = threatScore > 70 ? 'High Risk' : threatScore > 40 ? 'Medium Risk' : 'Low Risk';
    
    // Generate OWASP Top 10 vulnerabilities
    const owaspCategories = [
      { id: 'A01', name: 'Broken Access Control', description: 'Unauthorized access to resources' },
      { id: 'A02', name: 'Cryptographic Failures', description: 'Weak encryption detected' },
      { id: 'A03', name: 'Injection', description: 'SQL/Command injection patterns found' },
      { id: 'A04', name: 'Insecure Design', description: 'Poor security architecture' },
      { id: 'A05', name: 'Security Misconfiguration', description: 'Default configurations detected' },
      { id: 'A06', name: 'Vulnerable Components', description: 'Outdated libraries used' },
      { id: 'A07', name: 'Authentication Failures', description: 'Weak authentication mechanisms' },
      { id: 'A08', name: 'Software and Data Integrity', description: 'Unsigned code execution' },
      { id: 'A09', name: 'Logging Failures', description: 'Insufficient logging detected' },
      { id: 'A10', name: 'Server-Side Request Forgery', description: 'SSRF patterns identified' }
    ];
    
    // Select random vulnerabilities based on threat score
    const numVulns = Math.floor(threatScore / 20);
    const detectedVulns = [];
    for (let i = 0; i < numVulns && i < owaspCategories.length; i++) {
      const vuln = owaspCategories[Math.floor(Math.random() * owaspCategories.length)];
      detectedVulns.push({
        id: `vuln_${Date.now()}_${i}`,
        analysis_id: analysisId,
        owasp_id: vuln.id,
        owasp_name: vuln.name,
        severity: threatScore > 70 ? 'Critical' : threatScore > 40 ? 'High' : 'Medium',
        description: vuln.description,
        detected_at: new Date().toISOString()
      });
    }
    
    // Store analysis data
    const analysisData = {
      id: analysisId,
      user_id: user.id,
      file_name: fileName,
      file_size: fileSize,
      file_hash: fileHash,
      file_type: fileType,
      threat_score: threatScore,
      status,
      upload_date: new Date().toISOString(),
      analysis_completed: false,
      action_status: 'pending', // pending, mitigated, quarantined, blocked
      vulnerabilities: detectedVulns
    };
    
    await kv.set(`file_analyses:${analysisId}`, analysisData);
    
    // Add to user's analysis list
    const userAnalyses = await kv.get(`users:${user.id}:analyses`) || [];
    userAnalyses.unshift(analysisId);
    await kv.set(`users:${user.id}:analyses`, userAnalyses);
    
    // Update user stats
    const userData = await kv.get(`users:${user.id}`);
    if (userData) {
      userData.total_analyses = (userData.total_analyses || 0) + 1;
      if (threatScore > 70) {
        userData.total_threats_detected = (userData.total_threats_detected || 0) + 1;
      }
      await kv.set(`users:${user.id}`, userData);
    }
    
    return c.json({ 
      success: true, 
      analysisId,
      threatScore,
      status
    });
  } catch (error) {
    console.log(`File upload error: ${error}`);
    return c.json({ error: 'Internal server error during file upload' }, 500);
  }
});

// Get analysis details
app.get('/make-server-05e5e588/analysis/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken!);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const analysisId = c.req.param('id');
    const analysisData = await kv.get(`file_analyses:${analysisId}`);
    
    if (!analysisData) {
      return c.json({ error: 'Analysis not found' }, 404);
    }
    
    // Verify user owns this analysis
    if (analysisData.user_id !== user.id) {
      return c.json({ error: 'Unauthorized access to analysis' }, 403);
    }
    
    return c.json({ analysis: analysisData });
  } catch (error) {
    console.log(`Get analysis error: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get all analyses for user
app.get('/make-server-05e5e588/analysis/history', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken!);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const analysisIds = await kv.get(`users:${user.id}:analyses`) || [];
    const analyses = [];
    
    for (const id of analysisIds) {
      const analysis = await kv.get(`file_analyses:${id}`);
      if (analysis) {
        analyses.push(analysis);
      }
    }
    
    return c.json({ analyses });
  } catch (error) {
    console.log(`Get history error: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Delete analysis
app.delete('/make-server-05e5e588/analysis/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken!);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const analysisId = c.req.param('id');
    const analysisData = await kv.get(`file_analyses:${analysisId}`);
    
    if (!analysisData) {
      return c.json({ error: 'Analysis not found' }, 404);
    }
    
    if (analysisData.user_id !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // Delete analysis
    await kv.del(`file_analyses:${analysisId}`);
    
    // Remove from user's analysis list
    const userAnalyses = await kv.get(`users:${user.id}:analyses`) || [];
    const updatedAnalyses = userAnalyses.filter((id: string) => id !== analysisId);
    await kv.set(`users:${user.id}:analyses`, updatedAnalyses);
    
    console.log(`Analysis deleted: ${analysisId}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Delete analysis error: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ==================== FILE ACTION ROUTES ====================

// Apply action to analyzed file (mitigate, quarantine, block)
app.post('/make-server-05e5e588/analysis/:id/action', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken!);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const analysisId = c.req.param('id');
    const { action, notes } = await c.req.json();
    
    const analysisData = await kv.get(`file_analyses:${analysisId}`);
    
    if (!analysisData) {
      return c.json({ error: 'Analysis not found' }, 404);
    }
    
    if (analysisData.user_id !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // Update analysis with action
    analysisData.action_status = action; // mitigated, quarantined, blocked
    analysisData.action_date = new Date().toISOString();
    analysisData.action_notes = notes;
    await kv.set(`file_analyses:${analysisId}`, analysisData);
    
    // Store action history
    const actionId = `action_${Date.now()}`;
    await kv.set(`analysis_actions:${actionId}`, {
      id: actionId,
      analysis_id: analysisId,
      user_id: user.id,
      action_type: action,
      notes,
      timestamp: new Date().toISOString()
    });
    
    console.log(`Action applied to analysis ${analysisId}: ${action}`);
    return c.json({ success: true, action });
  } catch (error) {
    console.log(`Apply action error: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get files by action status
app.get('/make-server-05e5e588/files/by-status/:status', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken!);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const status = c.req.param('status');
    const analysisIds = await kv.get(`users:${user.id}:analyses`) || [];
    const filteredFiles = [];
    
    for (const id of analysisIds) {
      const analysis = await kv.get(`file_analyses:${id}`);
      if (analysis && analysis.action_status === status) {
        filteredFiles.push(analysis);
      }
    }
    
    return c.json({ files: filteredFiles });
  } catch (error) {
    console.log(`Get files by status error: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ==================== CLI COMMAND ROUTES ====================

// Execute CLI command
app.post('/make-server-05e5e588/cli/execute', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken!);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { command } = await c.req.json();
    
    // Simulate Windows cybersecurity command execution
    let output = '';
    const timestamp = new Date().toISOString();
    
    // Parse command and generate realistic output
    const cmd = command.toLowerCase().trim();
    
    if (cmd.startsWith('netstat')) {
      output = `Active Connections\n\n  Proto  Local Address          Foreign Address        State\n  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING\n  TCP    0.0.0.0:445            0.0.0.0:0              LISTENING\n  TCP    192.168.1.100:49152    20.190.151.7:443       ESTABLISHED\n  TCP    192.168.1.100:49153    142.250.185.14:443     ESTABLISHED\n  UDP    0.0.0.0:5353           *:*\n  UDP    192.168.1.100:137      *:*`;
    } else if (cmd.startsWith('tasklist')) {
      output = `Image Name                     PID Session Name        Mem Usage\n========================= ======== ================ ============\nSystem                           4 Services                 1,024 K\nsvchost.exe                    856 Services                12,456 K\nexplorer.exe                  4532 Console                 45,892 K\nchrome.exe                    7234 Console                234,567 K\nmalware_scanner.exe           9823 Console                 89,234 K`;
    } else if (cmd.startsWith('ipconfig')) {
      output = `Windows IP Configuration\n\nEthernet adapter Ethernet:\n\n   Connection-specific DNS Suffix  . : local\n   IPv4 Address. . . . . . . . . . . : 192.168.1.100\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . . : 192.168.1.1`;
    } else if (cmd.startsWith('whoami')) {
      output = `nexus\\security_analyst`;
    } else if (cmd.startsWith('systeminfo')) {
      output = `Host Name:                 NEXUS-WORKSTATION\nOS Name:                   Microsoft Windows 11 Enterprise\nOS Version:                10.0.22631 N/A Build 22631\nSystem Type:               x64-based PC\nProcessor(s):              1 Processor(s) Installed.\n                           [01]: Intel64 Family 6 Model 165 Stepping 2 GenuineIntel ~2904 Mhz`;
    } else if (cmd.startsWith('nslookup')) {
      const domain = cmd.split(' ')[1] || 'example.com';
      output = `Server:  UnKnown\nAddress:  192.168.1.1\n\nNon-authoritative answer:\nName:    ${domain}\nAddresses:  93.184.216.34\n          2606:2800:220:1:248:1893:25c8:1946`;
    } else if (cmd.startsWith('dir') || cmd.startsWith('ls')) {
      output = ` Volume in drive C has no label.\n Directory of C:\\Users\\security_analyst\n\n06/10/2025  02:30 PM    <DIR>          .\n06/10/2025  02:30 PM    <DIR>          ..\n06/09/2025  11:45 AM             2,456 ransomware.exe\n06/08/2025  03:22 PM             1,834 trojan_loader.dll\n06/07/2025  09:15 AM               890 suspicious_script.ps1\n               3 File(s)          5,180 bytes`;
    } else if (cmd === 'help') {
      output = `Available Commands:\n  netstat [-an]     - Display active network connections\n  tasklist          - Display running processes\n  ipconfig [/all]   - Display network configuration\n  whoami            - Display current user\n  systeminfo        - Display system information\n  nslookup [domain] - Query DNS records\n  dir / ls          - List directory contents\n  clear             - Clear terminal\n  help              - Display this help message`;
    } else if (cmd === 'clear') {
      return c.json({ success: true, output: 'CLEAR_TERMINAL' });
    } else {
      output = `'${command}' is not recognized as an internal or external command,\noperable program or batch file.\n\nType 'help' for available commands.`;
    }
    
    // Store command history
    const commandId = `cmd_${Date.now()}`;
    await kv.set(`cli_commands:${commandId}`, {
      id: commandId,
      user_id: user.id,
      command,
      output,
      timestamp
    });
    
    return c.json({ success: true, output, timestamp });
  } catch (error) {
    console.log(`CLI command error: ${error}`);
    return c.json({ error: 'Internal server error executing command' }, 500);
  }
});

// Get CLI command history
app.get('/make-server-05e5e588/cli/history', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken!);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const commands = await kv.getByPrefix('cli_commands:');
    const userCommands = commands.filter((cmd: any) => cmd.user_id === user.id);
    
    return c.json({ commands: userCommands });
  } catch (error) {
    console.log(`Get CLI history error: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ==================== DASHBOARD STATS ====================

app.get('/make-server-05e5e588/dashboard/stats', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken!);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userData = await kv.get(`users:${user.id}`);
    const analysisIds = await kv.get(`users:${user.id}:analyses`) || [];
    
    // Calculate stats
    let totalScanned = 0;
    let threatsDetected = 0;
    let quarantined = 0;
    let blocked = 0;
    
    for (const id of analysisIds) {
      const analysis = await kv.get(`file_analyses:${id}`);
      if (analysis) {
        totalScanned++;
        if (analysis.threat_score > 70) threatsDetected++;
        if (analysis.action_status === 'quarantined') quarantined++;
        if (analysis.action_status === 'blocked') blocked++;
      }
    }
    
    return c.json({
      stats: {
        totalScanned,
        threatsDetected,
        quarantined,
        blocked,
        systemHealth: Math.max(0, 100 - (threatsDetected * 5))
      }
    });
  } catch (error) {
    console.log(`Dashboard stats error: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Health check
app.get('/make-server-05e5e588/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
