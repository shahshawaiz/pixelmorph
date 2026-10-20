# Roadmap

## Next
- [ ] Security: admin login reads `NEXT_PUBLIC_ADMIN_PASSWORD`, which Next.js bundles into client JavaScript. Move auth server-side (middleware + httpOnly session)
- [ ] Add AI-generated or properly licensed example images for face swap (real-person samples were removed; pages show a placeholder)
- [ ] Web demo: general-object background removal (BiRefNet / MIT-licensed model) in addition to portrait matting
- [ ] Web demo: edge refinement and manual brush-to-fix for masks
- [ ] Backend: replace the hard-coded port 443 with config, plus a health endpoint and request size limits
- [ ] Tests for the face-shape classifier using synthetic landmark sets
- [ ] Re-enable frontend and CMS services in docker-compose for a one-command local setup

## Later
- [ ] Consent flow and watermarking for face-swap outputs
- [ ] Batch processing for background removal
- [ ] Hairstyle try-on preview based on detected face shape
