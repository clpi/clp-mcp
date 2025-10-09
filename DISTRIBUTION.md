# Distribution Guide

This document describes how CLP MCP is distributed across multiple package managers and platforms.

## Overview

CLP MCP provides pre-built binaries and packages for multiple platforms and package managers:

- **Binary Releases**: Direct executables for Linux, macOS, and Windows
- **Homebrew**: macOS package manager
- **Nix/NixOS**: Declarative package management
- **AUR**: Arch User Repository for Arch Linux
- **RPM**: Fedora, RHEL, CentOS via DNF/YUM
- **Guix**: GNU Guix package manager

## Automated Workflows

### 1. Binary Build Workflow (`.github/workflows/build-binaries.yml`)

**Trigger**: On release publication or version tags

**Platforms**:
- Linux (x64, ARM64)
- macOS (x64, ARM64/Apple Silicon)
- Windows (x64)

**Process**:
1. Builds standalone binaries using Bun's compilation feature
2. Creates checksums for each binary
3. Uploads binaries as release assets

**Usage by users**:
```bash
# Download the binary for your platform
curl -L -o clp-mcp https://github.com/clpi/clp-mcp/releases/latest/download/clp-mcp-linux-x64
chmod +x clp-mcp
./clp-mcp --help
```

### 2. Homebrew Distribution (`.github/workflows/homebrew.yml`)

**Trigger**: On release publication

**Process**:
1. Downloads macOS binaries from the release
2. Generates a Homebrew formula with checksums
3. Uploads formula as an artifact

**Setup for auto-publishing**:
1. Create a `homebrew-tap` repository at `https://github.com/clpi/homebrew-tap`
2. Uncomment the push step in the workflow
3. Add `HOMEBREW_TAP_TOKEN` secret with repository access

**Usage by users**:
```bash
# After tap is published
brew tap clpi/tap
brew install clp-mcp
```

### 3. Nix Package (`.github/workflows/nix.yml`)

**Trigger**: On release publication

**Process**:
1. Generates a Nix derivation (`default.nix`)
2. Creates a Flake configuration (`flake.nix`)
3. Uploads Nix files as artifacts

**To submit to nixpkgs**:
1. Fork https://github.com/NixOS/nixpkgs
2. Add package to `pkgs/by-name/cl/clp-mcp/package.nix`
3. Update sha256 hash after binaries are available
4. Submit a PR

**Usage by users**:
```bash
# Via flake
nix run github:clpi/clp-mcp

# Via profile
nix profile install github:clpi/clp-mcp

# After nixpkgs acceptance
nix profile install nixpkgs#clp-mcp
```

### 4. AUR Package (`.github/workflows/aur.yml`)

**Trigger**: On release publication

**Process**:
1. Downloads Linux binary
2. Generates PKGBUILD and .SRCINFO files
3. Uploads AUR files as artifacts

**Setup for auto-publishing**:
1. Create AUR account at https://aur.archlinux.org
2. Set up SSH key authentication
3. Uncomment the publish step in the workflow
4. Add `AUR_SSH_KEY` secret

**Manual publishing**:
```bash
# Clone the AUR repository
git clone ssh://aur@aur.archlinux.org/clp-mcp-bin.git
cd clp-mcp-bin

# Copy PKGBUILD and .SRCINFO from workflow artifacts
cp /path/to/PKGBUILD .
cp /path/to/.SRCINFO .

# Commit and push
git add PKGBUILD .SRCINFO
git commit -m "Update to version X.Y.Z"
git push
```

**Usage by users**:
```bash
# Using yay
yay -S clp-mcp-bin

# Using paru
paru -S clp-mcp-bin
```

### 5. RPM Package (`.github/workflows/rpm.yml`)

**Trigger**: On release publication

**Process**:
1. Builds RPM package using Fedora container
2. Creates both binary RPM and source RPM
3. Uploads to release and as artifacts

**To publish via COPR**:
1. Create account at https://copr.fedorainfracloud.org/
2. Create new project for clp-mcp
3. Upload the SRPM file from workflow artifacts

**Usage by users**:
```bash
# Via COPR (after setup)
sudo dnf copr enable clpi/clp-mcp
sudo dnf install clp-mcp

# Direct RPM install
sudo dnf install ./clp-mcp-*.rpm

# On RHEL/CentOS
sudo yum install ./clp-mcp-*.rpm
```

### 6. Guix Package (`.github/workflows/guix.yml`)

**Trigger**: On release publication

**Process**:
1. Generates Guix package definition in Scheme
2. Creates channel configuration
3. Uploads Guix files as artifacts

**Setup as a channel**:
1. Update base32 hash in the package definition
2. Users add channel to `~/.config/guix/channels.scm`

**To submit to GNU Guix**:
1. Clone https://git.savannah.gnu.org/git/guix.git
2. Add package to `gnu/packages/`
3. Submit patch to guix-patches@gnu.org

**Usage by users**:
```bash
# Add channel (in ~/.config/guix/channels.scm)
(cons* (channel
         (name 'clp-mcp)
         (url "https://github.com/clpi/clp-mcp"))
       %default-channels)

# Install
guix pull
guix install clp-mcp
```

## Release Process

### Creating a New Release

1. **Update version** in `package.json` and `src/index.ts`
2. **Commit changes**: `git commit -am "Bump version to X.Y.Z"`
3. **Create tag**: `git tag vX.Y.Z`
4. **Push changes**: `git push && git push --tags`
5. **Create GitHub release** from the tag
6. **Workflows automatically run**:
   - Build binaries for all platforms
   - Generate package definitions
   - Upload artifacts

### Post-Release Tasks

After the automated workflows complete:

1. **Homebrew**: 
   - If auto-publish is not set up, manually push formula to tap repository
   
2. **Nix**:
   - Update sha256 hash in the derivation
   - Optionally submit to nixpkgs
   
3. **AUR**:
   - If auto-publish is not set up, manually push to AUR
   
4. **RPM/COPR**:
   - Upload SRPM to COPR project
   
5. **Guix**:
   - Update base32 hash
   - Optionally submit to GNU Guix

## Verification

After release, verify each distribution method:

```bash
# Homebrew
brew install clp-mcp && clp-mcp --help

# Nix
nix run github:clpi/clp-mcp -- --help

# AUR (on Arch)
yay -S clp-mcp-bin && clp-mcp --help

# RPM (on Fedora)
sudo dnf install clp-mcp && clp-mcp --help

# Guix
guix install clp-mcp && clp-mcp --help

# Direct binary
./clp-mcp-linux-x64 --help
```

## Security

### Binary Integrity

All binaries include SHA256 checksums:
- Checksums are automatically generated during builds
- Published alongside binaries in releases
- Package managers verify checksums during installation

### Secrets Required

For full automation, set up these secrets in GitHub:

- `HOMEBREW_TAP_TOKEN`: GitHub token with access to homebrew-tap repo
- `AUR_SSH_KEY`: SSH private key for AUR publishing
- `GPG_PRIVATE_KEY`: For signing packages (optional)

## Troubleshooting

### Binary Won't Execute

```bash
# Make sure it's executable
chmod +x clp-mcp-*

# Check for missing dependencies (Linux)
ldd clp-mcp-linux-x64
```

### Package Manager Issues

- **Homebrew**: Update formula checksums if binaries change
- **AUR**: Ensure .SRCINFO is updated with PKGBUILD
- **Nix**: Hash format must be base32, use `nix hash` to convert
- **RPM**: Verify spec file syntax with `rpmlint`

## Contributing

To add a new package manager:

1. Create workflow in `.github/workflows/`
2. Follow existing workflow patterns
3. Add documentation to this file
4. Test with a pre-release
5. Submit PR

## Resources

- [Homebrew Formula Cookbook](https://docs.brew.sh/Formula-Cookbook)
- [Nix Package Guidelines](https://nixos.org/manual/nixpkgs/stable/#chap-quick-start)
- [AUR Submission Guidelines](https://wiki.archlinux.org/title/AUR_submission_guidelines)
- [Fedora RPM Guide](https://docs.fedoraproject.org/en-US/quick-docs/creating-rpm-packages/)
- [GNU Guix Cookbook](https://guix.gnu.org/en/cookbook/en/)
