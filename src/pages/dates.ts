import type { CustomDate } from "@/types";
import storage from "@/utils/localStorage.util";

const dates: CustomDate[] = storage.get<CustomDate[]>("dates", []);

function addDate() {}
function editDate() {}
function deleteDate() {}
function renderDates() {}
function buildDate() {}
function formatDuration(ms: number) {
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / (1000 * 60)) % 60;
  const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24)) % 30;
  const months = Math.floor(ms / (1000 * 60 * 60 * 24 * 30)) % 12;
  const years = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));

  const y = years ? `${years}y ` : "";
  const mo = (() => {
    if (years) {
      return `${months}mo `;
    } else {
      if (!months) return "";
      return `${months}mo `;
    }
  })();

  return `${y}${mo}${days}d ${hours}h ${minutes}m ${seconds}s`;
}

console.log(formatDuration(1_987_039_999_000));
