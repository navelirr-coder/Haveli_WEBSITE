param([switch]$CheckOnly)
$ErrorActionPreference = 'Stop'
$stagingRoot = [System.IO.Path]::GetFullPath($PSScriptRoot)
$patch = Get-Content -LiteralPath (Join-Path $stagingRoot 'patch-manifest.json') -Raw | ConvertFrom-Json
$destinationRoot = [System.IO.Path]::GetFullPath($patch.target)
$expectedRoot = 'C:\Users\navel\OneDrive\Desktop\HAVELI STUDIOS\Choudhari Farm Products CFP\CFP_Website'
if ($destinationRoot -ne $expectedRoot) { throw 'Unexpected CFP destination.' }
$verified = @()
foreach ($relative in $patch.files) {
  $sourceFile = [System.IO.Path]::GetFullPath((Join-Path $stagingRoot $relative))
  $targetFile = [System.IO.Path]::GetFullPath((Join-Path $destinationRoot $relative))
  if (-not $sourceFile.StartsWith($stagingRoot + '\') -or -not $targetFile.StartsWith($destinationRoot + '\')) { throw 'Path escapes the intended patch roots.' }
  $sourceHash = (Get-FileHash -LiteralPath $sourceFile -Algorithm SHA256).Hash
  $original = $patch.originals.PSObject.Properties[$relative]
  if ($original) {
    $currentHash = (Get-FileHash -LiteralPath $targetFile -Algorithm SHA256).Hash
    if ($currentHash -ne $original.Value -and $currentHash -ne $sourceHash) { throw "Source changed since inspection: $relative" }
  } elseif ((Test-Path -LiteralPath $targetFile) -and (Get-FileHash -LiteralPath $targetFile -Algorithm SHA256).Hash -ne $sourceHash) {
    throw "Refusing to overwrite an unrelated existing file: $relative"
  }
  $verified += [pscustomobject]@{Relative=$relative; Source=$sourceFile; Target=$targetFile; Hash=$sourceHash; Original=$original}
}
foreach ($item in $patch.unchanged.PSObject.Properties) {
  if ((Get-FileHash -LiteralPath (Join-Path $destinationRoot $item.Name) -Algorithm SHA256).Hash -ne $item.Value) { throw "Unrelated source changed since inspection: $($item.Name)" }
}
if ($CheckOnly) { Write-Output "Verified $($verified.Count) scoped files; destination and source guards pass."; exit }
foreach ($item in $verified) {
  if ($item.Original -and (Get-FileHash -LiteralPath $item.Target -Algorithm SHA256).Hash -eq $item.Original.Value) {
    $backupFile=Join-Path $stagingRoot ('backups\' + $item.Relative)
    if (-not (Test-Path -LiteralPath $backupFile)) { New-Item -ItemType Directory -Force -Path (Split-Path $backupFile) | Out-Null; Copy-Item -LiteralPath $item.Target -Destination $backupFile }
  }
  New-Item -ItemType Directory -Force -Path (Split-Path $item.Target) | Out-Null
  Copy-Item -LiteralPath $item.Source -Destination $item.Target
  if ((Get-FileHash -LiteralPath $item.Target -Algorithm SHA256).Hash -ne $item.Hash) { throw "Copy verification failed: $($item.Relative)" }
}
Write-Output "Applied and hash-verified $($verified.Count) files. Existing carousel code, shared styles, original campaigns and backend files were not modified."
