# Script за копиране на проекта без node_modules и build files
# Използвайте: .\copy-project.ps1

$source = "c:\Users\Hristo Dimov\cosypetsbyalice-1"
$destination = "c:\Users\Hristo Dimov\Desktop\cosypets-clean"

# Създайте destination папка
New-Item -ItemType Directory -Path $destination -Force

# Копирайте важните директории
Copy-Item -Path "$source\src" -Destination "$destination\src" -Recurse -Force
Copy-Item -Path "$source\public" -Destination "$destination\public" -Recurse -Force

# Копирайте конфигурационни файлове
$configFiles = @(
    "package.json",
    "package-lock.json",
    "vite.config.ts",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "tailwind.config.js",
    "postcss.config.js",
    "eslint.config.js",
    "index.html",
    ".env.example",
    ".gitignore",
    "FIREBASE_SETUP.md",
    "README.md"
)

foreach ($file in $configFiles) {
    if (Test-Path "$source\$file") {
        Copy-Item -Path "$source\$file" -Destination "$destination\$file" -Force
    }
}

Write-Host "✅ Проектът е копиран в: $destination" -ForegroundColor Green
Write-Host "📦 Размер без node_modules и dist" -ForegroundColor Cyan
Write-Host ""
Write-Host "Следващи стъпки:" -ForegroundColor Yellow
Write-Host "1. Отидете в папката: cd '$destination'" -ForegroundColor White
Write-Host "2. Инсталирайте dependencies: npm install" -ForegroundColor White
Write-Host "3. Създайте .env файл с Firebase credentials" -ForegroundColor White
Write-Host "4. Стартирайте: npm run dev" -ForegroundColor White
