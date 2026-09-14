# CosyPets FTP Upload Script
# Uploads dist/ folder to Superhosting public_html

$FTP_HOST = "ftp://riga.superhosting.bg"
$FTP_USER = "cozypets"
$FTP_PASS = "fs7W6yG-n#9K]V"
$FTP_ROOT = "$FTP_HOST/public_html"
$LOCAL_DIST = "C:\Users\Hristo Dimov\cosypetsbyalice-1\dist"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CosyPets - Upload to Superhosting" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$credentials = New-Object System.Net.NetworkCredential($FTP_USER, $FTP_PASS)

function FTP-Upload {
    param([string]$localFile, [string]$remotePath)
    
    try {
        $ftpRequest = [System.Net.FtpWebRequest]::Create($remotePath)
        $ftpRequest.Credentials = $credentials
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $ftpRequest.UseBinary = $true
        $ftpRequest.UsePassive = $true
        $ftpRequest.Timeout = 60000
        
        $fileContent = [System.IO.File]::ReadAllBytes($localFile)
        $ftpRequest.ContentLength = $fileContent.Length
        
        $requestStream = $ftpRequest.GetRequestStream()
        $requestStream.Write($fileContent, 0, $fileContent.Length)
        $requestStream.Close()
        
        $response = $ftpRequest.GetResponse()
        $response.Close()
        
        return $true
    } catch {
        Write-Host "  ERROR uploading $localFile : $_" -ForegroundColor Red
        return $false
    }
}

function FTP-MakeDir {
    param([string]$remotePath)
    
    try {
        $ftpRequest = [System.Net.FtpWebRequest]::Create($remotePath)
        $ftpRequest.Credentials = $credentials
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $ftpRequest.UsePassive = $true
        $response = $ftpRequest.GetResponse()
        $response.Close()
        Write-Host "  Created dir: $remotePath" -ForegroundColor DarkGray
    } catch {
        # Directory may already exist - ignore error
    }
}

# Get all files in dist/ recursively
$allFiles = Get-ChildItem -Path $LOCAL_DIST -Recurse -File -Force
Write-Host "Found $($allFiles.Count) files to upload..." -ForegroundColor Yellow

$uploaded = 0
$failed = 0

foreach ($file in $allFiles) {
    # Build relative path
    $relativePath = $file.FullName.Replace($LOCAL_DIST, "").Replace("\", "/").TrimStart("/")
    $remotePath = "$FTP_ROOT/$relativePath"
    
    # Create parent directory if needed
    $remoteDir = "$FTP_ROOT/" + ($relativePath -replace "/[^/]+$", "")
    if ($relativePath -match "/") {
        FTP-MakeDir -remotePath $remoteDir
    }
    
    Write-Host "  Uploading: $relativePath" -ForegroundColor Gray
    
    $success = FTP-Upload -localFile $file.FullName -remotePath $remotePath
    
    if ($success) {
        $uploaded++
        Write-Host "  OK: $relativePath" -ForegroundColor Green
    } else {
        $failed++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Upload Complete!" -ForegroundColor Green
Write-Host "  Uploaded: $uploaded files" -ForegroundColor Green
Write-Host "  Failed:   $failed files" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Site is now LIVE at: https://cozypets.bg" -ForegroundColor Yellow
