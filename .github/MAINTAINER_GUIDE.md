# Maintainer Guide - Distribution Workflows

This guide is for maintainers who need to create releases and manage distribution across multiple package managers.

## Quick Release Checklist

When creating a new release, follow these steps:

- [ ] Update version in `package.json`
- [ ] Update version in `src/index.ts` (if applicable)
- [ ] Update CHANGELOG.md with release notes
- [ ] Commit changes: `git commit -am "Release vX.Y.Z"`
- [ ] Create and push tag: `git tag vX.Y.Z && git push --tags`
- [ ] Create GitHub Release from the tag using `.github/RELEASE_TEMPLATE.md`
- [ ] Wait for workflows to complete (~5-10 minutes)
- [ ] Verify all workflows succeeded in GitHub Actions
- [ ] Verify binaries are uploaded to the release
- [ ] Complete post-release tasks (see below)

## Understanding the Workflows

### 1. Binary Build (`build-binaries.yml`)

**What it does:**
- Compiles standalone executables for 6 platforms
- Generates SHA256 checksums
- Uploads binaries to GitHub Release

**Triggers:**
- Automatically on release publication
- Manually via `gh workflow run build-binaries.yml`
- On version tags (`v*`)

**Outputs:**
- `clp-mcp-linux-x64` + `.sha256`
- `clp-mcp-linux-arm64` + `.sha256`
- `clp-mcp-darwin-x64` + `.sha256`
- `clp-mcp-darwin-arm64` + `.sha256`
- `clp-mcp-win32-x64.exe` + `.sha256`

**Post-release:** Nothing required, binaries are automatically uploaded.

### 2. Homebrew (`homebrew.yml`)

**What it does:**
- Downloads macOS binaries from the release
- Generates Homebrew formula with checksums
- Uploads formula as artifact

**Triggers:**
- Automatically on release publication
- Manually via `gh workflow run homebrew.yml -f version=X.Y.Z`

**Outputs:**
- `Formula/clp-mcp.rb` (as artifact)

**Post-release:**
1. Download the formula artifact from the workflow run
2. Push to `homebrew-tap` repository (if not automated)
   ```bash
   git clone https://github.com/clpi/homebrew-tap
   cd homebrew-tap
   cp /path/to/clp-mcp.rb Formula/
   git add Formula/clp-mcp.rb
   git commit -m "Update clp-mcp to vX.Y.Z"
   git push
   ```

**To automate:**
- Create `homebrew-tap` repository
- Add `HOMEBREW_TAP_TOKEN` secret
- Uncomment the auto-push section in the workflow

### 3. Nix (`nix.yml`)

**What it does:**
- Generates Nix package derivation
- Creates Flake configuration
- Calculates package hash

**Triggers:**
- Automatically on release publication
- Manually via `gh workflow run nix.yml -f version=X.Y.Z`

**Outputs:**
- `nix/default.nix` (as artifact)
- `nix/flake.nix` (as artifact)

**Post-release:**
1. Update the SHA256 hash in `default.nix` after binaries are available
   ```bash
   nix-hash --type sha256 --flat clp-mcp-linux-x64
   ```
2. Users can install immediately via:
   ```bash
   nix profile install github:clpi/clp-mcp
   ```

**Optional - Submit to nixpkgs:**
1. Fork https://github.com/NixOS/nixpkgs
2. Add package to `pkgs/by-name/cl/clp-mcp/package.nix`
3. Submit PR

### 4. AUR (`aur.yml`)

**What it does:**
- Downloads Linux binary
- Generates PKGBUILD and .SRCINFO
- Calculates SHA256 checksum

**Triggers:**
- Automatically on release publication
- Manually via `gh workflow run aur.yml -f version=X.Y.Z`

**Outputs:**
- `aur/PKGBUILD` (as artifact)
- `aur/.SRCINFO` (as artifact)

**Post-release:**
1. Download artifacts from the workflow run
2. Clone AUR repository (first time only):
   ```bash
   git clone ssh://aur@aur.archlinux.org/clp-mcp-bin.git
   ```
3. Update package:
   ```bash
   cd clp-mcp-bin
   cp /path/to/PKGBUILD .
   cp /path/to/.SRCINFO .
   git add PKGBUILD .SRCINFO
   git commit -m "Update to vX.Y.Z"
   git push
   ```

**To automate:**
- Add `AUR_SSH_KEY` secret with SSH private key
- Uncomment the auto-publish section in the workflow

### 5. RPM (`rpm.yml`)

**What it does:**
- Builds RPM packages in Fedora container
- Creates both binary and source RPMs
- Uploads to GitHub Release

**Triggers:**
- Automatically on release publication
- Manually via `gh workflow run rpm.yml -f version=X.Y.Z`

**Outputs:**
- `clp-mcp-X.Y.Z-1.*.rpm` (uploaded to release)
- `clp-mcp-X.Y.Z-1.src.rpm` (uploaded to release)

**Post-release:**
1. Optional: Publish to COPR for easier installation
   - Go to https://copr.fedorainfracloud.org/
   - Create/update project
   - Upload the `.src.rpm` file

Users can then install via:
```bash
sudo dnf copr enable clpi/clp-mcp
sudo dnf install clp-mcp
```

### 6. Guix (`guix.yml`)

**What it does:**
- Generates Guix package definition in Scheme
- Creates channel configuration

**Triggers:**
- Automatically on release publication
- Manually via `gh workflow run guix.yml -f version=X.Y.Z`

**Outputs:**
- `guix/clp-mcp.scm` (as artifact)
- `guix/channel.scm` (as artifact)

**Post-release:**
1. Download artifacts
2. Update base32 hash (Guix uses base32, not hex):
   ```bash
   guix hash clp-mcp-linux-x64
   ```
3. Users can add as channel in `~/.config/guix/channels.scm`

**Optional - Submit to GNU Guix:**
1. Clone https://git.savannah.gnu.org/git/guix.git
2. Add package to `gnu/packages/`
3. Email patch to guix-patches@gnu.org

## Testing Before Release

### Test Individual Workflows

```bash
# Test binary build
gh workflow run build-binaries.yml

# Test package workflows with a test version
gh workflow run homebrew.yml -f version=0.0.0-test
gh workflow run nix.yml -f version=0.0.0-test
gh workflow run aur.yml -f version=0.0.0-test
gh workflow run rpm.yml -f version=0.0.0-test
gh workflow run guix.yml -f version=0.0.0-test
```

### Test Binary Compilation Locally

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Build binary
bun install
bun build --compile --target=bun-linux-x64 src/index.ts --outfile clp-mcp-test

# Test binary
./clp-mcp-test --help
```

## Monitoring Releases

After creating a release, monitor:

1. **GitHub Actions**: Check all workflows complete successfully
   - https://github.com/clpi/clp-mcp/actions

2. **Release Assets**: Verify all binaries and checksums are uploaded
   - https://github.com/clpi/clp-mcp/releases

3. **Workflow Artifacts**: Download and verify package definitions

## Troubleshooting

### Workflow Failed

1. Check the workflow logs in GitHub Actions
2. Common issues:
   - Release doesn't exist yet (create release first)
   - Binary not found (wait for build-binaries to complete)
   - Invalid version format (must be X.Y.Z)

### Binary Won't Run

1. Ensure it's executable: `chmod +x clp-mcp-*`
2. Check dependencies: `ldd clp-mcp-linux-x64`
3. Verify checksum: `sha256sum -c clp-mcp-linux-x64.sha256`

### Package Manager Issues

- **Homebrew**: Formula checksums must match exactly
- **Nix**: Use base32 hash, not hex
- **AUR**: .SRCINFO must be regenerated with `makepkg --printsrcinfo > .SRCINFO`
- **RPM**: Check spec file with `rpmlint`

## Security

### Required Secrets

For full automation, add these secrets to GitHub repository settings:

| Secret | Purpose | Priority |
|--------|---------|----------|
| `HOMEBREW_TAP_TOKEN` | Auto-publish to homebrew-tap | Optional |
| `AUR_SSH_KEY` | Auto-publish to AUR | Optional |
| `GPG_PRIVATE_KEY` | Sign packages | Optional |

### Best Practices

1. Always verify checksums after download
2. Use secrets for credentials, never commit them
3. Review workflow changes carefully before merging
4. Test workflows on pre-release versions first
5. Monitor workflow execution logs for security issues

## Support

For issues with the distribution workflows:

1. Check [DISTRIBUTION.md](./DISTRIBUTION.md) for user-facing docs
2. Review workflow logs in GitHub Actions
3. Open an issue with the `distribution` label
4. Tag @clpi for maintainer-specific questions

## Quick Reference

```bash
# Create release
git tag vX.Y.Z && git push --tags

# Manually trigger workflow
gh workflow run <workflow-name>.yml [-f version=X.Y.Z]

# Check workflow status
gh run list --workflow=<workflow-name>.yml

# Download artifacts
gh run download <run-id>

# View workflow logs
gh run view <run-id> --log
```
