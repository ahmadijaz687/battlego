# ARCHITECTURE CONTRACT

Never redesign or rewrite completed modules.

Always inspect the current repository before making changes.

Reuse existing:
- Components
- Hooks
- Services
- Stores
- Utilities
- Theme
- Navigation
- API layer
- Query layer
- Offline queue

Never introduce duplicate implementations.

If an existing implementation can be extended, extend it instead of replacing it.

Maintain feature-based architecture throughout the project.

---

# QUALITY GATE

Before completing any task:
- TypeScript passes
- ESLint passes
- No unresolved imports
- No duplicate code
- No unused exports
- No dead code
- Existing functionality still works
- New functionality is integrated
- Loading state exists
- Empty state exists
- Error state exists
- Offline state exists
- Accessibility labels added
- Responsive layouts verified

If any requirement fails, fix it before continuing.

---

# AUTONOMOUS EXECUTION

Repeat until every deliverable for the current phase is complete:
1. Inspect repository
2. Find missing functionality
3. Implement
4. Refactor if architecture improves
5. Verify
6. Fix discovered issues
7. Perform self-review
8. Continue automatically

Do not pause between features.

Only stop when:
- Every deliverable for the current phase is complete
- A genuine blocker requires user input
- Or the phase has passed all quality gates