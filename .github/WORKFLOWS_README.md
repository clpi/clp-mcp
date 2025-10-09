# Distribution Workflows Overview

This directory contains GitHub Actions workflows for building and distributing CLP MCP across multiple platforms and package managers.

## Available Workflows

### Core Workflows

#### `build-binaries.yml` - Binary Compilation
**Purpose**: Compiles standalone executables for all platforms  
**Triggers**: Release publication, version tags (`v*`), manual dispatch  
**Platforms**: 
- Linux (x64, ARM64)
- macOS (Intel x64, Apple Silicon ARM64)
- Windows (x64)

**Output**: Binaries with SHA256 checksums uploaded to GitHub Release

---

#### `homebrew.yml` - Homebrew Formula
**Purpose**: Generates Homebrew formula for macOS installation  
**Triggers**: Release publication, manual dispatch  
**Output**: `Formula/clp-mcp.rb` as artifact  
**Post-release**: Push formula to homebrew-tap repository

---

#### `nix.yml` - Nix Package
**Purpose**: Creates Nix package derivation and Flake  
**Triggers**: Release publication, manual dispatch  
**Output**: 
- `nix/default.nix` - Package derivation
- `nix/flake.nix` - Flake configuration

**Post-release**: Update SHA256 hash, optionally submit to nixpkgs

---

#### `aur.yml` - Arch User Repository
**Purpose**: Generates AUR package files for Arch Linux  
**Triggers**: Release publication, manual dispatch  
**Output**: 
- `aur/PKGBUILD` - Build script
- `aur/.SRCINFO` - Package metadata

**Post-release**: Push to AUR repository

---

#### `rpm.yml` - RPM Package
**Purpose**: Builds RPM packages for Fedora/RHEL/CentOS  
**Triggers**: Release publication, manual dispatch  
**Output**: Binary and source RPM uploaded to GitHub Release  
**Post-release**: Optionally publish to COPR

---

#### `guix.yml` - GNU Guix Package
**Purpose**: Creates GNU Guix package definition  
**Triggers**: Release publication, manual dispatch  
**Output**: 
- `guix/clp-mcp.scm` - Package definition
- `guix/channel.scm` - Channel configuration

**Post-release**: Update base32 hash, optionally submit to GNU Guix

---

### Existing Workflows

- `check.yml` - Build verification on PRs
- `codeql.yml` - Security scanning
- `docker-image.yml` - Docker image build
- `release.yml` - NPM package publishing

## Workflow Execution Order

On release publication:

```
1. build-binaries.yml (runs first, ~3-5 min)
   ├─ Builds all platform binaries in parallel
   └─ Uploads to GitHub Release

2. Package workflows (run in parallel after binaries available, ~2-5 min each)
   ├─ homebrew.yml
   ├─ nix.yml
   ├─ aur.yml
   ├─ rpm.yml
   └─ guix.yml
```

Total time: ~5-10 minutes for all workflows to complete

## Quick Start

### For Users

See [DISTRIBUTION.md](../../DISTRIBUTION.md) for installation instructions.

### For Maintainers

See [MAINTAINER_GUIDE.md](./MAINTAINER_GUIDE.md) for release process and workflow management.

## Testing Workflows

All workflows support manual dispatch for testing:

```bash
# Using GitHub CLI
gh workflow run build-binaries.yml
gh workflow run homebrew.yml -f version=1.0.0-test
gh workflow run nix.yml -f version=1.0.0-test
# ... etc
```

Or use the "Run workflow" button in the GitHub Actions UI.

## Workflow Dependencies

```
build-binaries.yml
    │
    ├─ Downloads: None
    └─ Uploads: Binaries to GitHub Release
    
homebrew.yml
    │
    ├─ Downloads: Binaries from GitHub Release
    └─ Uploads: Formula as artifact
    
nix.yml
    │
    ├─ Downloads: Source tarball from GitHub
    └─ Uploads: Nix files as artifact
    
aur.yml
    │
    ├─ Downloads: Linux binary from GitHub Release
    └─ Uploads: PKGBUILD as artifact
    
rpm.yml
    │
    ├─ Downloads: Linux binary from GitHub Release
    └─ Uploads: RPM to GitHub Release
    
guix.yml
    │
    ├─ Downloads: Linux binary from GitHub Release
    └─ Uploads: Guix files as artifact
```

## Secrets Required

For full automation (all are optional):

| Secret | Used By | Purpose |
|--------|---------|---------|
| `GITHUB_TOKEN` | All | Automatic (provided by GitHub) |
| `HOMEBREW_TAP_TOKEN` | homebrew.yml | Auto-publish to tap |
| `AUR_SSH_KEY` | aur.yml | Auto-publish to AUR |
| `GPG_PRIVATE_KEY` | All | Package signing (future) |

## Troubleshooting

### Workflow Failed

1. Check workflow logs in GitHub Actions
2. Verify release exists and binaries are uploaded
3. Check version format (must be `X.Y.Z`)

### Common Issues

- **"Release not found"**: Create GitHub Release before workflows run
- **"Binary not found"**: Wait for `build-binaries.yml` to complete first
- **"Invalid checksum"**: Binaries may have been modified, regenerate them

## File Structure

```
.github/
├── workflows/
│   ├── aur.yml           # AUR package workflow
│   ├── build-binaries.yml # Binary compilation
│   ├── check.yml         # Build check (existing)
│   ├── codeql.yml        # Security scan (existing)
│   ├── docker-image.yml  # Docker build (existing)
│   ├── guix.yml          # Guix package workflow
│   ├── homebrew.yml      # Homebrew formula workflow
│   ├── nix.yml           # Nix package workflow
│   ├── release.yml       # NPM publish (existing)
│   └── rpm.yml           # RPM package workflow
├── MAINTAINER_GUIDE.md   # Maintainer documentation
├── RELEASE_TEMPLATE.md   # Release notes template
└── WORKFLOWS_README.md   # This file
```

## Contributing

When adding new workflows:

1. Follow existing patterns for triggers and structure
2. Support manual dispatch with version parameter
3. Include comprehensive error handling
4. Document in this README and MAINTAINER_GUIDE.md
5. Add to DISTRIBUTION.md user guide
6. Test with manual dispatch before merging

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Bun Compilation](https://bun.sh/docs/bundler/executables)
- [Package Manager Docs](../../DISTRIBUTION.md#resources)

## Support

For issues with workflows:
1. Check [MAINTAINER_GUIDE.md](./MAINTAINER_GUIDE.md)
2. Review workflow logs
3. Open an issue with `workflow` label
