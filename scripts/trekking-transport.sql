-- Trekking packages: day-one transfer is a public shared shuttle van.
-- Updates the transport summary so it matches the Day 1 itinerary wording
-- in scripts/tour-packages-itineraries.sql. Safe to re-run.

-- Mount Kenya: shared shuttle van from Nairobi to the trailhead.
update public.tour_packages
set transport = 'Public shared shuttle van from Nairobi',
    updated_at = now()
where slug in (
  'mount-kenya-trekking-3-days',
  'mount-kenya-lakes-trek-4-days',
  'mount-kenka-sirimon-chogoria-5-days'
);

-- Kilimanjaro Machame route: shared shuttle van from Arusha to Machame Gate.
update public.tour_packages
set transport = 'Public shared shuttle van from Arusha to Machame Gate',
    updated_at = now()
where slug in (
  'kilimanjaro-machame-6-days',
  'kilimanjaro-machame-7-days'
);

-- Kilimanjaro Lemosho route: shared shuttle van from Kilimanjaro Airport.
update public.tour_packages
set transport = 'Public shared shuttle van from Kilimanjaro Airport',
    updated_at = now()
where slug = 'kilimanjaro-lemosho-8-days';

-- Verify.
select slug, transport
from public.tour_packages
where slug in (
  'mount-kenya-trekking-3-days',
  'mount-kenya-lakes-trek-4-days',
  'mount-kenka-sirimon-chogoria-5-days',
  'kilimanjaro-machame-6-days',
  'kilimanjaro-machame-7-days',
  'kilimanjaro-lemosho-8-days'
)
order by slug;
