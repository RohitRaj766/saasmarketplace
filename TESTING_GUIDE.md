# 🧪 Manual Testing Guide

This guide helps you manually test all features of the SaaS Marketplace application after the Tailwind CSS transformation.

---

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd backend
npm run dev
```

### 2. Seed the Database (First Time Only)
```bash
cd backend
npm run seed:production
```

### 3. Start All MFEs
```bash
# Windows
start-mfe-dev.bat

# Linux/Mac
./start-mfe-dev.sh
```

### 4. Start the Shell
```bash
cd shell
npm run dev
```

### 5. Open Browser
Navigate to: `http://localhost:5173`

---

## 🔐 Test Accounts

### Atlassian Tenant (Blue Theme)
- **Email**: `mike@atlassian.com`
- **Password**: `password123`
- **Role**: Admin
- **Theme**: Blue (#3B82F6)

### Zoho Tenant (Red Theme)
- **Email**: `sridhar@zoho.com`
- **Password**: `password123`
- **Role**: Admin
- **Theme**: Red (#EF4444)

---

## ✅ Testing Checklist

### 1. Login & Authentication

#### Test Steps:
1. Open `http://localhost:5173`
2. Verify login page displays correctly
3. Try invalid credentials → Should show error
4. Login with `mike@atlassian.com` / `password123`
5. Verify redirect to dashboard
6. Check user info in header (name, avatar, tenant)

#### Expected Results:
- ✅ Login page has split-screen design
- ✅ Form validation works
- ✅ Error messages display
- ✅ Successful login redirects to dashboard
- ✅ User info displays in header

---

### 2. Dark Mode

#### Test Steps:
1. Click moon/sun icon in header
2. Verify entire app switches to dark mode
3. Navigate to each MFE (Orders, Billing, Analytics, Admin)
4. Verify all components adapt to dark mode
5. Refresh page → Dark mode should persist
6. Toggle back to light mode

#### Expected Results:
- ✅ Toggle button switches icon (Moon ↔ Sun)
- ✅ All components change colors
- ✅ Text remains readable (good contrast)
- ✅ Charts adapt to dark mode
- ✅ Modals and overlays work in dark mode
- ✅ Preference persists after refresh

---

### 3. Tenant Theming

#### Test Steps:
1. Login as Atlassian user (`mike@atlassian.com`)
2. Verify blue theme (#3B82F6) throughout app
3. Check sidebar active states (blue)
4. Check primary buttons (blue)
5. Logout
6. Login as Zoho user (`sridhar@zoho.com`)
7. Verify red theme (#EF4444) throughout app
8. Check sidebar active states (red)
9. Check primary buttons (red)

#### Expected Results:
- ✅ Atlassian: Blue primary color everywhere
- ✅ Zoho: Red primary color everywhere
- ✅ Theme changes without page reload
- ✅ All MFEs respect tenant theme
- ✅ Charts use tenant color

---

### 4. Responsive Design

#### Test Steps:
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test at different widths:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1440px
4. Navigate through all pages
5. Verify layouts adapt correctly

#### Expected Results:
- ✅ **Mobile (< 640px)**:
  - Sidebar collapses to hamburger
  - Cards stack vertically
  - Tables scroll horizontally
  - Forms are full-width
- ✅ **Tablet (640-1024px)**:
  - Sidebar toggleable
  - 2-column grids
  - Tables may scroll
- ✅ **Desktop (> 1024px)**:
  - Full sidebar visible
  - Multi-column grids
  - All content visible

---

### 5. Shell Application

#### Test Steps:
1. **Dashboard**:
   - Verify 4 metric cards display
   - Check quick action buttons
   - Verify recent activity list
2. **Header**:
   - Click user avatar → Menu opens
   - Click dark mode toggle
   - Verify tenant name displays
3. **Sidebar**:
   - Click each navigation item
   - Verify active state highlights
   - Check icons display correctly

#### Expected Results:
- ✅ Dashboard loads quickly
- ✅ Metrics display with icons
- ✅ Navigation works smoothly
- ✅ Active states highlight correctly
- ✅ User menu opens/closes

---

### 6. Orders MFE

#### Test Steps:
1. Click "Orders" in sidebar
2. **Order List**:
   - Verify table displays orders
   - Check status badges (colors)
   - Click "View" button → Opens detail
   - Click "New Order" button
3. **Order Detail**:
   - Verify two-card layout
   - Check order info displays
   - Check line items table
   - Verify totals calculate correctly
4. **Create Order**:
   - Fill out form
   - Add line items
   - Verify calculations update
   - Submit form

#### Expected Results:
- ✅ Table displays with proper styling
- ✅ Status badges color-coded
- ✅ Detail page shows all info
- ✅ Create form validates input
- ✅ Calculations work correctly
- ✅ Loading states show

---

### 7. Billing MFE

#### Test Steps:
1. Click "Billing" in sidebar
2. **Invoices Tab**:
   - Verify invoice table displays
   - Check status badges
   - Click "Download" button
   - Click "Pay Now" button
3. **Payments Tab**:
   - Verify payment history table
   - Check payment method icons
   - Verify transaction statuses
4. **Settings Tab**:
   - Select payment method
   - Toggle auto-pay
   - Click "Save Changes"

#### Expected Results:
- ✅ Tab navigation works smoothly
- ✅ Invoice table styled correctly
- ✅ Payment history displays
- ✅ Settings form functional
- ✅ Icons display correctly
- ✅ Status badges color-coded

---

### 8. Analytics MFE

#### Test Steps:
1. Click "Analytics" in sidebar
2. **Dashboard**:
   - Verify 4 metric cards display
   - Check trend indicators (arrows)
   - Verify colors match trends
3. **Date Selector**:
   - Click "7 Days" button
   - Click "30 Days" button
   - Click "90 Days" button
   - Verify active state changes
4. **Charts**:
   - Verify Revenue chart displays
   - Verify Orders chart displays
   - Check chart responsiveness
5. **Team Performance**:
   - Verify table displays
   - Check avatar circles
   - Verify badges display

#### Expected Results:
- ✅ Metric cards with gradients
- ✅ Trend indicators show correctly
- ✅ Date selector works
- ✅ Charts render properly
- ✅ Charts adapt to dark mode
- ✅ Team table styled correctly

---

### 9. Admin MFE

#### Test Steps:
1. Click "Admin" in sidebar
2. **Team Members Tab**:
   - Verify card grid displays
   - Check role badges
   - Click "Edit" on role → Dropdown appears
   - Change role → Updates
   - Click "Deactivate User" (don't confirm)
3. **Invite Modal**:
   - Click "Invite Team Member"
   - Fill email and select role
   - Verify role description updates
   - Click "Cancel" or "Send Invitation"
4. **Activity Logs Tab**:
   - Click "Activity Logs" tab
   - Verify timeline displays
   - Check action icons
   - Verify timestamps
   - Check metadata badges

#### Expected Results:
- ✅ Card grid responsive
- ✅ Role badges color-coded
- ✅ Role editing works
- ✅ Modal opens/closes smoothly
- ✅ Timeline displays correctly
- ✅ Action icons show
- ✅ Timestamps formatted

---

### 10. Keyboard Navigation

#### Test Steps:
1. Use Tab key to navigate
2. Verify focus indicators visible
3. Use Enter to activate buttons
4. Use Escape to close modals
5. Navigate through forms with Tab

#### Expected Results:
- ✅ Tab order is logical
- ✅ Focus rings visible (blue outline)
- ✅ Enter activates buttons
- ✅ Escape closes modals
- ✅ All interactive elements reachable

---

### 11. Performance

#### Test Steps:
1. Open DevTools → Network tab
2. Refresh page (Ctrl+R)
3. Check load times
4. Navigate between MFEs
5. Monitor console for errors

#### Expected Results:
- ✅ Initial load < 3 seconds
- ✅ MFEs load on demand
- ✅ No console errors
- ✅ Smooth transitions
- ✅ No memory leaks

---

### 12. Cross-Browser Testing

#### Test Steps:
1. Test in Chrome
2. Test in Firefox
3. Test in Edge
4. Test in Safari (if available)
5. Verify all features work

#### Expected Results:
- ✅ Chrome: Perfect
- ✅ Firefox: Perfect
- ✅ Edge: Perfect
- ✅ Safari: Good (minor differences OK)

---

## 🐛 Common Issues & Solutions

### Issue: MFEs not loading
**Solution**: 
1. Ensure all MFEs are running in preview mode
2. Check ports: Orders (4173), Billing (4174), Analytics (4175), Admin (4176)
3. Rebuild MFEs: `npm run build` in each MFE folder

### Issue: Dark mode not persisting
**Solution**: 
1. Check localStorage in DevTools
2. Clear browser cache
3. Verify ThemeProvider is wrapping app

### Issue: Tenant theme not changing
**Solution**: 
1. Logout and login with different tenant
2. Check tenant data in localStorage
3. Verify tenant colors in tailwind.base.config.js

### Issue: 401 Authentication Error
**Solution**: 
1. Seed database: `cd backend && npm run seed:production`
2. Check backend is running on port 3001
3. Verify .env file in backend folder

### Issue: Charts not displaying
**Solution**: 
1. Verify Recharts is installed in Analytics MFE
2. Check console for errors
3. Ensure data is being fetched from API

---

## 📊 Testing Report Template

Use this template to document your testing:

```markdown
## Testing Report

**Date**: [Date]
**Tester**: [Your Name]
**Browser**: [Chrome/Firefox/Edge/Safari]
**Screen Size**: [Desktop/Tablet/Mobile]

### Results

- [ ] Login & Authentication
- [ ] Dark Mode
- [ ] Tenant Theming
- [ ] Responsive Design
- [ ] Shell Application
- [ ] Orders MFE
- [ ] Billing MFE
- [ ] Analytics MFE
- [ ] Admin MFE
- [ ] Keyboard Navigation
- [ ] Performance
- [ ] Cross-Browser

### Issues Found

1. [Issue description]
   - **Severity**: [Critical/High/Medium/Low]
   - **Steps to Reproduce**: [Steps]
   - **Expected**: [Expected behavior]
   - **Actual**: [Actual behavior]

### Notes

[Any additional observations]
```

---

## ✅ Sign-Off Checklist

Before marking testing complete:

- [ ] All test accounts work
- [ ] Dark mode works in all MFEs
- [ ] Both tenant themes work
- [ ] Responsive design verified
- [ ] All MFEs load correctly
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Keyboard navigation works
- [ ] Cross-browser tested
- [ ] Documentation reviewed

---

**Happy Testing! 🎉**

If you find any issues, document them and create a fix plan.
