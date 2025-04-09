#\!/bin/bash
# Script to clean up macOS resource fork files

# Find all ._* files in the current directory and subdirectories, but exclude node_modules
find . -name "._*" -not -path "*/node_modules/*" -type f -print0 | xargs -0 rm -f

echo "Cleaned up macOS resource fork files"
