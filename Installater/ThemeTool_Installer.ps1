# Self-elevate the script if required
if (-Not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] 'Administrator')) {
    if ([int](Get-CimInstance -Class Win32_OperatingSystem | Select-Object -ExpandProperty BuildNumber) -ge 6000) {
        $Command = "-File `"" + $MyInvocation.MyCommand.Path + "`" " + $MyInvocation.UnboundArguments
        Start-Process -FilePath PowerShell.exe -Verb RunAs -ArgumentList $Command
        Exit
    }
}

$toolJson = '{
        "version": "1.0",
        "name": "Theme Tool",
        "description": "To build / edit Report-Themes",
        "path": "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe", 
        "arguments": "Start-Process -FilePath \"msedge.exe\" -ArgumentList \"--app=https://apanasara.github.io/PBi_Theme_Tool/\"",
        "iconData": "image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAACHUlEQVRYhcWXQW7TQBSGvzfjpC1KwV2wZglIrLgBEgsEEmrXXIcL9BqFIjgAa6TuWZQjIKQEpahJxjPDwiWJxzOOnbjll56Ucd7M+/37fzM29AHjzzHeYbxvCIfxH8OpsnPxn37EAdPW+TPu81CW+dnOBDI0s475leGuGAPDDvlFyKcPdFOgZwJjYK9Dfg8KVI07nQjuQSQr4e8dFJAgSnz/oXn2PFJcQKn6KoECrduwYPZGMzgD7jXljUfw6r3j4qmAqLoSGUe8kMlq2BKi/DHeNBYHOPoDr795Lh5p0FInsKUHBIxCIpJGoIzATIHyEE7Z2gNiqK+WgM3K1lSRKdt3gQVxLVNVmsDWCihDa89aDfOb9P4U6PAIClcqECNwJx5oImA3EBAnn8TLMYHeAx4vfyunOPnykrN3p3ECzpWPQIWr1CtWh57DzGQn8VWr+Pz2K1eHvxldRbaGwq5MGBJo8kA+yfVsv/3RZvUCJHIWW5cmsMkD2urwUhJCceONAIVddUEXBboSKFcr6pftmglvUwEkoUATgV4VkKKMEMWdKWASCtjtFMgnOWYQWTBVH5tWYL5Maqh4Wx5wbvWi+l+6oGgg0L8HIvnFmgdq//VKINEF620YokmBfJKzGC46EojthA5S7y5NClwfXNvhov13VrILrIPUfexXD+TKaX355HKqnDrXVjttNZtiuQ+E8c8D1XDM+cAvqXxJ/wVWmuzZZH7ACQAAAABJRU5ErkJggg=="
    }'

$filePaths = "C:\Program Files (x86)\Common Files\Microsoft Shared\Power BI Desktop\External Tools\ThemeTool.pbitool.json", "%commonprogramfiles%\Microsoft Shared\Power BI Desktop\External Tools\ThemeTool.pbitool.json"

$wsh = New-Object -ComObject Wscript.Shell

# Write the string to the file (overwrites if the file already exists)
foreach ($filePath in $filePaths) {
    # Check if the directory exists, create it if it doesn't
    $directory = Split-Path -Path $filePath
    if (Test-Path -Path $directory) {
        # Directory exists
        try {
            $toolJson | Out-File -FilePath $filePath -Encoding UTF8 -Force
            $wsh.Popup("External tool is installed into Power Bi Desktop !!!`n`n$filePath", 0, "Finished...", 0x40)
            exit
        }
        catch {
            $wsh.Popup("An error occurred:`n`n$_`nfile: $filePath", 0, "Error in Installation", 0x10)
        }
    }
    else {
        $wsh.Popup("No directory found at:`n`n$directory", 0, "No Installation-Directory found", 0x30)
    }
}
