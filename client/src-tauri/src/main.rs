#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use std::path::Path;
use regex::Regex;
use serde::{Serialize};

#[derive(Serialize, Clone, Debug)]
struct Diagnostic {
    line: usize,
    message: String,
    severity: String,
}

#[derive(Serialize, Debug)]
struct CompileResult {
    success: bool,
    pdf_path: Option<String>,
    diagnostics: Vec<Diagnostic>,
    logs: String,
}

#[tauri::command]
async fn compile_latex(project_path: String, main_file: String) -> Result<CompileResult, String> {
    println!("Compiling {} in {}", main_file, project_path);

    // 1. Prepare Command
    // Using absolute path to guarantee execution (MiKTeX)
    let output = Command::new(r"C:\Users\Cauã V\AppData\Local\Programs\MiKTeX\miktex\bin\x64\xelatex.exe")
        .args(&[
            "-interaction=nonstopmode",
            "-synctex=1",
            &main_file
        ])
        .current_dir(&project_path)
        .output()
        .map_err(|e| format!("Failed to execute xelatex: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);
    let full_log = format!("{}\n{}", stdout, stderr);

    // 2. Parse Logs for Diagnostics
    let diagnostics = parse_latex_logs(&full_log);

    // 3. Determine Success
    // xelatex returns 0 on success, but with nonstopmode it might return 0 even with errors? 
    // Usually non-zero on fatal, but let's check PDF existence too.
    
    let pdf_filename = main_file.replace(".tex", ".pdf");
    // Look for PDF in root (since we removed output-directory)
    let pdf_path = Path::new(&project_path).join(&pdf_filename);
    
    // Simple check: if PDF exists and is recent (optional complexity), we consider it partial success.
    // Generally checking exit code is good, but latex is quirky.
    let success = output.status.success() || pdf_path.exists();

    Ok(CompileResult {
        success,
        pdf_path: if pdf_path.exists() { Some(pdf_path.to_string_lossy().into_owned()) } else { None },
        diagnostics,
        logs: full_log,
    })
}

fn parse_latex_logs(log: &str) -> Vec<Diagnostic> {
    let mut diagnostics = Vec::new();
    // Regex for basic LaTeX errors: "! Error Message" looking ahead for line number usually
    // Simplified strategy: capture "! " lines as errors.
    
    let error_regex = Regex::new(r"^! (.*)$").unwrap();
    let line_regex = Regex::new(r"l\.(\d+)").unwrap();
    
    let lines: Vec<&str> = log.lines().collect();
    
    for (i, line) in lines.iter().enumerate() {
        if let Some(cap) = error_regex.captures(line) {
            let message = cap.get(1).map_or("", |m| m.as_str()).trim();
            let mut line_num = 0;
            
            // Look ahead for "l.10"
            for j in 1..=5 {
                if i + j < lines.len() {
                    if let Some(l_cap) = line_regex.captures(lines[i+j]) {
                        if let Ok(n) = l_cap[1].parse::<usize>() {
                            line_num = n;
                            break;
                        }
                    }
                }
            }
            
            diagnostics.push(Diagnostic {
                line: line_num,
                message: message.to_string(),
                severity: "error".to_string(),
            });
        }
    }

    diagnostics
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![compile_latex])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
