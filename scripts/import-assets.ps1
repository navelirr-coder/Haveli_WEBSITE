$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path -Parent $PSScriptRoot
$studioRoot = Split-Path -Parent $projectRoot
$assetSelections = @(
    @{ Id='haveli-masks'; Source='HAVELI Branding/3x/1Asset 3.png'; Role='Original theatre-mask illustration; home hero'; Folder='studio' },
    @{ Id='haveli-pink-card'; Source='HAVELI Branding/business card finals/2x/F p card@2x.png'; Role='Complete paired business-card artwork; self-identity project'; Folder='studio' },
    @{ Id='haveli-green-card'; Source='HAVELI Branding/business card finals/2x/F g card@2x.png'; Role='Complete paired business-card artwork; self-identity gallery'; Folder='studio' },
    @{ Id='haveli-red-card'; Source='HAVELI Branding/business card finals/2x/F r card@2x.png'; Role='Complete paired business-card artwork; self-identity gallery'; Folder='studio' },
    @{ Id='avaia-symbol'; Source='00 AVAIA/logo.png'; Role='Supplied AVAIA symbol; identity project cover'; Folder='avaia' },
    @{ Id='avaia-card'; Source='00 AVAIA/1x/Avaia B F.png'; Role='Original visiting-card artwork; identity application'; Folder='avaia' },
    @{ Id='cfp-chips'; Source='Choudhari Farm Products CFP/CRUNCHIES_catalogue/Jowar Chips Pouch.png'; Role='Original Jowar Chips packaging mockup; cover'; Folder='cfp' },
    @{ Id='cfp-ragi'; Source='Choudhari Farm Products CFP/CRUNCHIES_catalogue/CFP Ragi Sticks Snack Pouch.png'; Role='Original Ragi Sticks packaging mockup; gallery'; Folder='cfp' },
    @{ Id='cfp-bajra'; Source='Choudhari Farm Products CFP/CRUNCHIES_catalogue/Bajra Chivda Pouches.png'; Role='Original Bajra Chivda packaging mockup; gallery'; Folder='cfp' },
    @{ Id='yugma-logo'; Source='05 YUGMA/YUGMA logo.jpg'; Role='Original YUGMA International logo artwork; identity cover'; Folder='yugma' }
)
$records = foreach ($selection in $assetSelections) {
    $sourcePath = Join-Path $studioRoot $selection.Source
    $sourceFile = Get-Item -LiteralPath $sourcePath
    $assetImage = [System.Drawing.Image]::FromFile($sourcePath)
    $width = $assetImage.Width
    $height = $assetImage.Height
    $assetImage.Dispose()
    $publicDirectory = Join-Path $projectRoot ('public/assets/' + $selection.Folder)
    New-Item -ItemType Directory -Force -Path $publicDirectory | Out-Null
    $destination = Join-Path $publicDirectory $sourceFile.Name
    if (Test-Path -LiteralPath $destination) {
        if ((Get-FileHash -LiteralPath $destination).Hash -ne (Get-FileHash -LiteralPath $sourcePath).Hash) { throw "Refusing to overwrite $destination" }
    } else { Copy-Item -LiteralPath $sourcePath -Destination $destination }
    [ordered]@{ id=$selection.Id; source=$selection.Source; filename=$sourceFile.Name; format=$sourceFile.Extension.TrimStart('.'); width=$width; height=$height; bytes=$sourceFile.Length; sha256=(Get-FileHash -LiteralPath $sourcePath -Algorithm SHA256).Hash; role=$selection.Role; publicPath=('/assets/' + $selection.Folder + '/' + [Uri]::EscapeDataString($sourceFile.Name)); status='supplied' }
}
New-Item -ItemType Directory -Force -Path (Join-Path $projectRoot 'src/data') | Out-Null
$manifestPath = Join-Path $projectRoot 'src/data/assets.json'
# Progressive imports must not discard later assets (such as the AVAIA case study).
$retainedRecords = @()
if (Test-Path -LiteralPath $manifestPath) {
    $existingRecords = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
    $importedIds = @($records | ForEach-Object { $_.id })
    $retainedRecords = @($existingRecords | Where-Object { $_.id -notin $importedIds })
}
@($records) + $retainedRecords | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $manifestPath -Encoding utf8

$identityInventory = foreach ($relativeRoot in @('HAVELI LOGO','HAVELI Branding')) {
    Get-ChildItem -LiteralPath (Join-Path $studioRoot $relativeRoot) -File -Recurse | Where-Object { $_.Extension -in '.png','.ai','.pdf','.zip' } | ForEach-Object {
        $pixelWidth=$null; $pixelHeight=$null
        if ($_.Extension -eq '.png') { $img=[System.Drawing.Image]::FromFile($_.FullName); $pixelWidth=$img.Width; $pixelHeight=$img.Height; $img.Dispose() }
        [ordered]@{source=[System.IO.Path]::GetRelativePath($studioRoot,$_.FullName).Replace('\','/'); filename=$_.Name; format=$_.Extension; width=$pixelWidth; height=$pixelHeight; bytes=$_.Length; role= $(if ($_.Extension -eq '.ai') {'Illustrator source; retained in original location, not web-ready'} elseif ($_.Extension -eq '.pdf') {'Print artwork reference; retained in original location'} elseif ($_.Extension -eq '.zip') {'Audit source archive; retained in original location'} else {'Identity raster export; inspect before selection'}) }
    }
}
$identityInventory | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $projectRoot 'docs/identity-asset-inventory.json') -Encoding utf8

$snapshotPath = Join-Path $projectRoot 'reference/brand-audit'
New-Item -ItemType Directory -Force -Path $snapshotPath | Out-Null
$snapshotHashes = foreach ($filename in @('index.html','app.js','db.js','admin.js','export.js','style.css')) {
    $sourcePath = Join-Path $studioRoot ('HAVELI Branding/brand audit/' + $filename)
    $destination = Join-Path $snapshotPath $filename
    if (Test-Path -LiteralPath $destination) {
        if ((Get-FileHash -LiteralPath $destination).Hash -ne (Get-FileHash -LiteralPath $sourcePath).Hash) { throw "Reference differs: $filename" }
    } else { Copy-Item -LiteralPath $sourcePath -Destination $destination }
    [ordered]@{filename=$filename;sha256=(Get-FileHash -LiteralPath $sourcePath -Algorithm SHA256).Hash}
}
$snapshotHashes | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $projectRoot 'reference/brand-audit-hashes.json') -Encoding utf8
Write-Output "Copied 10 inspected assets without modification and preserved 6 original audit files."
