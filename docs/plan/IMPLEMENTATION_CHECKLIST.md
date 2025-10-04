# KeyCut Online - Implementation Checklist

## 📋 Post-MVP Enhancement Plan

Based on the original MVP specification in `spec.md`, this checklist outlines remaining features and improvements needed for the complete KeyCut Online experience.

---

## 🚨 **Critical for Launch** (Must Implement)

### 1. SMS Notifications (Primary Channel)
**Status**: ❌ Missing
**Priority**: 🔴 Critical
**Estimated Effort**: 4-6 hours

**Requirements from Spec**:
- SMS as primary notification channel for order updates
- Order placed, dispatched, tracking updates
- Booking confirmations and day-of reminders

**Implementation Plan**:
- [ ] Set up Twilio integration (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`)
- [ ] Create SMS service in `/lib/sms.ts`
- [ ] Update order/booking creation to send SMS confirmations
- [ ] Add SMS templates for status updates
- [ ] Test SMS delivery and fallback to email

### 2. Australia Post Integration
**Status**: ❌ Missing
**Priority**: 🔴 Critical
**Estimated Effort**: 8-12 hours

**Requirements from Spec**:
- Shipping label generation for mail-in orders
- Tracking number assignment and updates
- Integration with Australia Post API

**Implementation Plan**:
- [ ] Set up Australia Post API integration (`AUSTRALIA_POST_API_KEY`)
- [ ] Create shipping label generation service
- [ ] Implement tracking number assignment
- [ ] Add tracking status updates to order flow
- [ ] Create printable PDF shipping labels

### 3. Analytics Implementation
**Status**: ❌ Missing
**Priority**: 🔴 Critical
**Estimated Effort**: 6-8 hours

**Requirements from Spec**:
- Track conversion funnel (Landing → Payment → Success)
- Monitor completion times and user behavior
- Event tracking for 12+ key user actions

**Implementation Plan**:
- [ ] Set up Google Analytics 4 or Mixpanel
- [ ] Implement event tracking for all user journeys
- [ ] Add conversion funnel tracking
- [ ] Create dashboard for key metrics
- [ ] Set up performance monitoring

---

## 🟡 **Important Enhancements** (Should Implement)

### 4. Add-ons System for Locksmith Bookings
**Status**: ❌ Missing
**Priority**: 🟡 High
**Estimated Effort**: 4-6 hours

**Requirements from Spec**:
- Extra copies, key tags, Bluetooth trackers
- Dynamic pricing based on add-ons

**Implementation Plan**:
- [ ] Design add-ons data structure
- [ ] Create add-ons selection UI
- [ ] Update pricing calculations
- [ ] Add add-ons to booking flow
- [ ] Update admin interface

### 5. Social Proof & Testimonials
**Status**: ❌ Missing
**Priority**: 🟡 High
**Estimated Effort**: 3-4 hours

**Requirements from Spec**:
- Rotating customer reviews with suburb and date
- Trust signals and testimonials

**Implementation Plan**:
- [ ] Create testimonials data structure
- [ ] Build testimonial display component
- [ ] Add rotating testimonials to homepage
- [ ] Include suburb and date information
- [ ] Add testimonial management to admin

### 6. Scarcity Messaging for Time Slots
**Status**: ❌ Missing
**Priority**: 🟡 Medium
**Estimated Effort**: 2-3 hours

**Requirements from Spec**:
- "Only 3 slots left today in Richmond 3121"
- Real-time availability indicators

**Implementation Plan**:
- [ ] Add availability tracking to time slots
- [ ] Create scarcity messaging component
- [ ] Update time slot picker with availability
- [ ] Add real-time updates for slot availability

### 7. PDF Invoice Generation
**Status**: ❌ Missing
**Priority**: 🟡 Medium
**Estimated Effort**: 3-4 hours

**Requirements from Spec**:
- Downloadable PDF invoices with GST
- Professional formatting with ABN

**Implementation Plan**:
- [ ] Set up PDF generation service (jsPDF or similar)
- [ ] Create invoice template with branding
- [ ] Add PDF download to order tracking
- [ ] Include ABN and GST breakdown
- [ ] Test PDF generation and formatting

---

## 🟢 **Polish & Enhancement** (Nice to Have)

### 8. Reschedule Functionality
**Status**: ❌ Missing
**Priority**: 🟢 Medium
**Estimated Effort**: 4-5 hours

**Requirements from Spec**:
- Allow users to reschedule bookings
- Fair-go policy for cancellations

**Implementation Plan**:
- [ ] Add reschedule option to order tracking
- [ ] Create reschedule flow with time slot selection
- [ ] Update booking status management
- [ ] Add admin notifications for reschedules
- [ ] Implement fair-go cancellation policy

### 9. Enhanced Trust Badges
**Status**: ⚠️ Partial
**Priority**: 🟢 Low
**Estimated Effort**: 2-3 hours

**Requirements from Spec**:
- Police-checked, fully insured badges
- Authorized locksmith partner certifications

**Implementation Plan**:
- [ ] Create trust badge component system
- [ ] Add certification badges to homepage
- [ ] Include partner credentials
- [ ] Add verification icons and links

### 10. Advanced Admin Features
**Status**: ✅ Enhanced (but could be improved)
**Priority**: 🟢 Low
**Estimated Effort**: 6-8 hours

**Potential Enhancements**:
- [ ] Real-time availability management for time slots
- [ ] Advanced reporting and analytics dashboard
- [ ] Bulk email communication tools
- [ ] Customer support ticket system
- [ ] Integration with accounting software

---

## 📊 **Technical Debt & Improvements**

### 11. Performance Optimization
**Status**: ⚠️ Needs attention
**Priority**: 🟢 Medium

**Areas to Optimize**:
- [ ] Image optimization for uploaded photos
- [ ] Database query optimization
- [ ] Caching strategies for pricing and availability
- [ ] CDN optimization for static assets

### 12. Enhanced Error Handling
**Status**: ✅ Good (but could be improved)
**Priority**: 🟢 Low

**Improvements**:
- [ ] Better offline handling
- [ ] Retry mechanisms for failed uploads/payments
- [ ] Enhanced error messaging with recovery suggestions
- [ ] Network failure recovery

### 13. Advanced Features (Future)
**Status**: ❌ Not started
**Priority**: 🟢 Future

**Potential Features**:
- [ ] Mobile app (React Native)
- [ ] Subscription plans for property managers
- [ ] Loyalty program
- [ ] Referral system
- [ ] Multi-language support
- [ ] Advanced photo-to-blank detection

---

## 🎯 **Success Metrics to Track**

Once implemented, monitor these KPIs from the original spec:

- **Landing → Payment start**: ≥40%
- **Payment start → Success**: ≥70%
- **Median completion time**: ≤60s (returning users) / ≤90s (new)
- **Photo attach rate**: ≥60%
- **Restricted key drop-off**: ↓ over time

---

## 📅 **Implementation Priority**

### **Phase 1: Launch Critical** (Week 1-2)
1. SMS Notifications
2. Australia Post Integration
3. Analytics Implementation

### **Phase 2: Enhancement** (Week 3-4)
4. Add-ons System
5. Social Proof & Testimonials
6. PDF Invoice Generation

### **Phase 3: Polish** (Week 5-6)
7. Scarcity Messaging
8. Reschedule Functionality
9. Enhanced Trust Badges

---

## ✅ **Current Status Summary**

**Already Implemented & Working:**
- ✅ Complete mail-in copy flow with photo upload
- ✅ Locksmith booking with address autocomplete and time slots
- ✅ Payment processing with Apple/Google Pay
- ✅ Email notifications and confirmations
- ✅ Admin dashboard with bulk operations
- ✅ Address autocomplete (Google Places API)
- ✅ Saved addresses system
- ✅ Order cancellation functionality
- ✅ Enhanced security with signed URLs
- ✅ Professional UI and mobile optimization

**Ready for Production:** The core platform is fully functional and exceeds the original MVP specification in most areas.

**Next Focus:** Implement the 3 critical features (SMS, Australia Post, Analytics) to complete the full user experience as specified.
