# Script to replace all localhost URLs with production backend URL

$files = @(
    "d:\000\word-tracker-main\frontend\src\app\components\plan-detail\plan-detail.component.ts",
    "d:\000\word-tracker-main\frontend\src\app\components\create-plan\create-plan.component.ts",
    "d:\000\word-tracker-main\frontend\src\app\components\create-checklist\create-checklist.component.ts",
    "d:\000\word-tracker-main\frontend\src\app\components\community\community.component.ts",
    "d:\000\word-tracker-main\frontend\src\app\components\checklist-page\checklist-page.component.ts",
    "d:\000\word-tracker-main\frontend\src\app\components\api-tester\api-tester.component.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Replace localhost URLs
        $content = $content -replace "http://localhost:8000/api", '${environment.apiUrl}/api'
        $content = $content -replace "http://localhost/word-tracker/backend-php/api", '${environment.apiUrl}/api'
        
        # Add environment import if not present
        if ($content -notmatch "import.*environment") {
            $content = $content -replace "(import.*@angular/common/http';)", "`$1`nimport { environment } from '../../../environments/environment';"
        }
        
        Set-Content $file $content -NoNewline
        Write-Host "Fixed: $file"
    }
}

Write-Host "All files updated!"
