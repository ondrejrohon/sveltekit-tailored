#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}🔧 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install git first."
    exit 1
fi

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    print_error "Bun is not installed. Please install bun first."
    exit 1
fi

echo -e "${GREEN}"
echo "🚀 SvelteKit Tailored Template Scaffolder"
echo "=========================================${NC}"
echo

# Get repository name from user
while true; do
    echo -n "Enter your new repository name: "
    read repo_name
    
    # Validate repo name (basic validation)
    if [[ -z "$repo_name" ]]; then
        print_error "Repository name cannot be empty!"
        continue
    fi
    
    if [[ "$repo_name" =~ [^a-zA-Z0-9._-] ]]; then
        print_error "Repository name can only contain letters, numbers, dots, underscores, and hyphens!"
        continue
    fi
    
    if [[ -d "$repo_name" ]]; then
        print_error "Directory '$repo_name' already exists!"
        continue
    fi
    
    break
done

echo
print_step "Creating new SvelteKit project: $repo_name"

# Clone the template repository
print_step "Cloning template repository..."
if git clone https://github.com/ondrejrohon/sveltekit-tailored-template.git "$repo_name"; then
    print_success "Repository cloned successfully"
else
    print_error "Failed to clone repository"
    exit 1
fi

# Navigate to the new directory
cd "$repo_name" || exit 1

# Remove the .git folder
print_step "Removing existing git history..."
rm -rf .git
print_success "Git history removed"

# Update package.json
print_step "Updating package.json..."
if command -v sed &> /dev/null; then
    # Use sed to replace the name in package.json (handle potential escaping issues)
    sed -i.bak 's/"name": "sveltekit-tailored-template"/"name": "'$repo_name'"/' package.json && rm package.json.bak
    print_success "package.json updated"
else
    print_warning "sed not available, please manually update the name in package.json"
fi

# Update the main page title
print_step "Updating main page title..."
if command -v sed &> /dev/null; then
    # Convert repo name to title case for display
    display_name=$(echo "$repo_name" | sed 's/-/ /g' | sed 's/_/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')
    # Replace the entire h1 content with the project name
    sed -i.bak 's/<h1 class="text-3xl font-extrabold">.*<\/h1>/<h1 class="text-3xl font-extrabold">'$display_name'<\/h1>/' src/routes/+page.svelte && rm src/routes/+page.svelte.bak
    print_success "Main page title updated to: $display_name"
else
    print_warning "sed not available, please manually update the title in src/routes/+page.svelte"
fi

# Initialize new git repository
print_step "Initializing new git repository..."
git init
print_success "New git repository initialized"

# Add and commit all files
print_step "Committing scaffolded files..."
git add .
git commit -m "Scaffold sveltekit-tailored-template"
print_success "Initial commit created"

# Install dependencies
print_step "Installing dependencies with bun..."
if bun install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

echo
echo -e "${GREEN}🎉 Project '$repo_name' created successfully!${NC}"
echo
print_warning "Don't forget to:"
echo "  📝 Set up environment variables (.env file)"
echo "     - JWT_SECRET: openssl rand -base64 32"
echo "     - ENCRYPTION_KEY: openssl rand -base64 16"
echo "     - DATABASE_URL: (based on your database)"
echo "  🔐 Configure Google Sign-In (GCP Console)"
echo "  🚀 Set up Coolify deployment"
echo "  🌐 Configure domain on Cloudflare"
echo "  📧 Verify email sending functionality"
echo
echo -e "${BLUE}Next steps:${NC}"
echo "  cd $repo_name"
echo "  cp .env.example .env"
echo "  # Edit .env with your values"
echo "  bun run dev"
echo
