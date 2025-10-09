# Distribution Guide

This document describes how clp-mcp is distributed across various platforms and package managers.

## Automated Build and Release Process

All builds and releases are automated through GitHub Actions workflows. When a new version is tagged or released, the following happens automatically:

### Binary Builds

The `build-binaries.yml` workflow builds standalone binaries for:
- **Linux**: x64 and arm64
- **macOS**: x64 (Intel) and arm64 (Apple Silicon)
- **Windows**: x64

Binaries are uploaded as artifacts and attached to GitHub releases.

### Package Manager Distribution

The `release.yml` workflow automatically builds binaries and uploads them to GitHub Releases when a tag is pushed.

The following package manager workflows can be triggered automatically or manually:

#### 1. Homebrew (macOS)
**Workflow**: `homebrew.yml`
- Creates a Homebrew formula
- Supports both Intel and Apple Silicon Macs
- Formula committed to repository for tap usage

**Installation**:
```bash
brew tap clpi/tap
brew install clp-mcp
```

#### 2. Debian/Ubuntu (APT)
**Workflow**: `debian-package.yml`
- Builds `.deb` package for amd64
- Includes proper metadata and documentation
- Uploaded to GitHub Releases

**Installation**:
```bash
wget https://github.com/clpi/clp-mcp/releases/download/vX.Y.Z/clp-mcp_X.Y.Z_amd64.deb
sudo dpkg -i clp-mcp_X.Y.Z_amd64.deb
```

#### 3. Fedora/RHEL (DNF/RPM)
**Workflow**: `rpm-package.yml`
- Builds `.rpm` package for x86_64
- Compatible with Fedora, RHEL, CentOS, Rocky Linux
- Uploaded to GitHub Releases

**Installation**:
```bash
wget https://github.com/clpi/clp-mcp/releases/download/vX.Y.Z/clp-mcp-X.Y.Z-1.x86_64.rpm
sudo dnf install ./clp-mcp-X.Y.Z-1.x86_64.rpm
# or
sudo rpm -i clp-mcp-X.Y.Z-1.x86_64.rpm
```

#### 4. Arch Linux (AUR)
**Workflow**: `aur-package.yml`
- Generates PKGBUILD and .SRCINFO files
- Files committed to repository
- Ready for AUR submission

**Installation**:
```bash
# Using AUR helper
yay -S clp-mcp
# or
paru -S clp-mcp

# Manual
git clone https://aur.archlinux.org/clp-mcp.git
cd clp-mcp
makepkg -si
```

#### 5. NixOS (Nix)
**Workflow**: `nix-package.yml`
- Creates `default.nix` and `flake.nix`
- Supports both classic Nix and Flakes
- Files committed to repository

**Installation**:
```bash
# Using flakes
nix profile install github:clpi/clp-mcp

# Using nix-env
nix-env -iA nixpkgs.clp-mcp

# Temporary shell
nix shell github:clpi/clp-mcp

# Run directly
nix run github:clpi/clp-mcp
```

#### 6. GNU Guix
**Workflow**: `guix-package.yml`
- Creates Guix package definition (`.scm`)
- Includes channel configuration
- Files committed to repository

**Installation**:
```bash
# Add channel (edit ~/.config/guix/channels.scm)
guix pull
guix install clp-mcp

# Or use local definition
guix package -f clp-mcp.scm
```

#### 7. Snap
**Workflow**: `snap-package.yml`
- Builds Snap package using snapcraft
- Supports strict confinement
- Can be published to Snap Store

**Installation**:
```bash
# From Snap Store (if published)
sudo snap install clp-mcp

# From file
sudo snap install --dangerous clp-mcp_X.Y.Z_amd64.snap
```

#### 8. Flatpak
**Workflow**: `flatpak-package.yml`
- Creates Flatpak manifest
- Builds Flatpak bundle
- Ready for Flathub submission

**Installation**:
```bash
# From Flathub (if published)
flatpak install flathub com.github.clpi.clp-mcp

# From file
flatpak install --user clp-mcp-X.Y.Z.flatpak
flatpak run com.github.clpi.clp-mcp
```

## Release Process

### Automated Release (Recommended)

1. Create and push a version tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. The `release.yml` workflow automatically:
   - Builds binaries for all platforms
   - Creates a GitHub Release
   - Uploads all binaries with checksums

3. Optionally trigger the `release-all-platforms.yml` workflow to build all package formats:
   - Go to Actions tab
   - Select "Release All Platforms"
   - Click "Run workflow"
   - Enter version number (e.g., 1.0.0)

### Manual Release

Each workflow can be triggered manually:

1. Go to the Actions tab in GitHub
2. Select the desired workflow (e.g., "Build Debian Package")
3. Click "Run workflow"
4. Enter the version number
5. Click "Run workflow"

## NPM Distribution

The package is also published to npm when a release is created:

```bash
npm install -g clp-mcp
```

## Verification

All binary releases include SHA256 checksums for verification:

```bash
# Download binary and checksum
wget https://github.com/clpi/clp-mcp/releases/download/vX.Y.Z/clp-mcp-X.Y.Z-linux-x64.tar.gz
wget https://github.com/clpi/clp-mcp/releases/download/vX.Y.Z/clp-mcp-X.Y.Z-linux-x64.tar.gz.sha256

# Verify
sha256sum -c clp-mcp-X.Y.Z-linux-x64.tar.gz.sha256
```

## Supported Architectures

| Platform | x64 | ARM64 | ARM |
|----------|-----|-------|-----|
| Linux    | ✅  | ✅    | ❌  |
| macOS    | ✅  | ✅    | ❌  |
| Windows  | ✅  | ❌    | ❌  |

## Platform-Specific Notes

### Linux
- Debian/Ubuntu packages require glibc 2.31+
- RPM packages compatible with EL8+, Fedora 35+
- Snap and Flatpak packages are fully sandboxed

### macOS
- Binaries are not signed (will show security warning on first run)
- Use `xattr -d com.apple.quarantine clp-mcp` if needed
- Homebrew installation is recommended

### Windows
- Binary is not signed
- May trigger Windows Defender SmartScreen
- Add to PATH manually or use installer (future)

## Contributing

To contribute package definitions or improve the build process:

1. Test changes locally
2. Submit a pull request
3. Ensure workflows pass
4. Update documentation if needed

## Troubleshooting

### Binary not found after installation
Ensure the binary location is in your PATH:
```bash
# Linux/macOS
export PATH=$PATH:/usr/local/bin

# Check installation
which clp-mcp
```

### Permission denied
Make the binary executable:
```bash
chmod +x clp-mcp
```

### Package manager issues
- **APT**: Run `sudo apt update` first
- **DNF**: Clear cache with `sudo dnf clean all`
- **Homebrew**: Run `brew update` first
- **Snap**: Ensure snapd is installed and running

## Future Plans

- [ ] Windows MSI installer
- [ ] macOS .pkg installer  
- [ ] Code signing for macOS and Windows
- [ ] Official Snap Store publication
- [ ] Flathub submission
- [ ] Chocolatey package (Windows)
- [ ] Scoop manifest (Windows)
- [ ] AppImage (Linux)
- [ ] Docker Hub automated builds
- [ ] Official APT/DNF repositories

## Support

For issues with:
- **Builds**: Open an issue on GitHub
- **Package managers**: Check package-specific documentation
- **Installation**: Consult this guide or open an issue
