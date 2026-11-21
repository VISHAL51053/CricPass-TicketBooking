import type { FanAddon, Seat } from '../types';

export interface SelectedAddon {
  addon: FanAddon;
  quantity: number;
}

export const calculateBookingTotals = (seats: Seat[], addons: SelectedAddon[]) => {
  const seatsSubtotal = seats.reduce((total, seat) => total + seat.price, 0);
  const addonsSubtotal = addons.reduce(
    (total, item) => total + item.addon.price * item.quantity,
    0
  );
  const subtotal = seatsSubtotal + addonsSubtotal;
  const facilityFee = seats.length > 0 ? 150 : 0;
  const gst = Math.round(subtotal * 0.18);

  return { seatsSubtotal, addonsSubtotal, subtotal, facilityFee, gst, total: subtotal + facilityFee + gst };
};
