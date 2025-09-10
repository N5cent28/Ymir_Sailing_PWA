# 🌍 Club Configuration Guide

This guide explains how to configure the Ymir Sailing Club system for different locations worldwide.

## Quick Setup

To configure the system for your sailing club, set these environment variables:

### Required Configuration

```bash
# Timezone (use IANA timezone names)
CLUB_TIMEZONE=America/Chicago

# Location Information
CLUB_COUNTRY=US
CLUB_CITY=Madison
CLUB_LATITUDE=43.0731
CLUB_LONGITUDE=-89.4012

# Date/Time Formatting
DATE_FORMAT=MM/DD/YYYY
TIME_FORMAT=12h
LOCALE=en-US
```

## Configuration Examples

### 🇮🇸 Iceland (Reykjavik)
```bash
CLUB_TIMEZONE=Atlantic/Reykjavik
CLUB_COUNTRY=IS
CLUB_CITY=Reykjavik
CLUB_LATITUDE=64.1466
CLUB_LONGITUDE=-21.9426
DATE_FORMAT=DD/MM/YYYY
TIME_FORMAT=24h
LOCALE=is-IS
```

### 🇦🇺 Australia (Sydney)
```bash
CLUB_TIMEZONE=Australia/Sydney
CLUB_COUNTRY=AU
CLUB_CITY=Sydney
CLUB_LATITUDE=-33.8688
CLUB_LONGITUDE=151.2093
DATE_FORMAT=DD/MM/YYYY
TIME_FORMAT=12h
LOCALE=en-AU
```

### 🇬🇧 United Kingdom (London)
```bash
CLUB_TIMEZONE=Europe/London
CLUB_COUNTRY=GB
CLUB_CITY=London
CLUB_LATITUDE=51.5074
CLUB_LONGITUDE=-0.1278
DATE_FORMAT=DD/MM/YYYY
TIME_FORMAT=24h
LOCALE=en-GB
```

### 🇩🇪 Germany (Berlin)
```bash
CLUB_TIMEZONE=Europe/Berlin
CLUB_COUNTRY=DE
CLUB_CITY=Berlin
CLUB_LATITUDE=52.5200
CLUB_LONGITUDE=13.4050
DATE_FORMAT=DD.MM.YYYY
TIME_FORMAT=24h
LOCALE=de-DE
```

### 🇫🇷 France (Paris)
```bash
CLUB_TIMEZONE=Europe/Paris
CLUB_COUNTRY=FR
CLUB_CITY=Paris
CLUB_LATITUDE=48.8566
CLUB_LONGITUDE=2.3522
DATE_FORMAT=DD/MM/YYYY
TIME_FORMAT=24h
LOCALE=fr-FR
```

### 🇯🇵 Japan (Tokyo)
```bash
CLUB_TIMEZONE=Asia/Tokyo
CLUB_COUNTRY=JP
CLUB_CITY=Tokyo
CLUB_LATITUDE=35.6762
CLUB_LONGITUDE=139.6503
DATE_FORMAT=YYYY/MM/DD
TIME_FORMAT=24h
LOCALE=ja-JP
```

## Configuration Details

### Timezone
Use IANA timezone names from the [Time Zone Database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

Common timezones:
- `America/New_York` (US Eastern)
- `America/Chicago` (US Central)
- `America/Denver` (US Mountain)
- `America/Los_Angeles` (US Pacific)
- `Europe/London` (UK)
- `Europe/Paris` (France)
- `Europe/Berlin` (Germany)
- `Asia/Tokyo` (Japan)
- `Australia/Sydney` (Australia)
- `Atlantic/Reykjavik` (Iceland)

### Date Formats
- `MM/DD/YYYY` - US format (12/31/2024)
- `DD/MM/YYYY` - European format (31/12/2024)
- `YYYY-MM-DD` - ISO format (2024-12-31)
- `DD.MM.YYYY` - German format (31.12.2024)

### Time Formats
- `12h` - 12-hour format (2:30 PM)
- `24h` - 24-hour format (14:30)

### Locale
Use [BCP 47 language tags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale):
- `en-US` - English (US)
- `en-GB` - English (UK)
- `en-AU` - English (Australia)
- `is-IS` - Icelandic
- `de-DE` - German
- `fr-FR` - French
- `ja-JP` - Japanese

## Setting Up for Your Club

1. **Find your timezone**: Use [timezone lookup tools](https://www.timeanddate.com/worldclock/) to find your IANA timezone name.

2. **Get coordinates**: Use [Google Maps](https://maps.google.com) to get your club's latitude and longitude.

3. **Choose formats**: Select date/time formats that match your local conventions.

4. **Set locale**: Choose the appropriate locale for your language and region.

5. **Update environment variables**: Add these to your `.env` file or deployment environment.

## Benefits

- ✅ **Automatic DST handling** - No manual timezone adjustments needed
- ✅ **Consistent time storage** - All times stored in UTC in database
- ✅ **Local display** - Times shown in your club's timezone
- ✅ **Easy deployment** - Simple environment variable configuration
- ✅ **Future-proof** - Easy to change location or add new features

## Testing

After configuration, test that:
1. Check-in times are stored correctly
2. Overdue calculations work properly
3. Time displays match your local timezone
4. Date formats match your local conventions

## Migration from Hardcoded Fix

If you're migrating from the hardcoded timezone fix:
1. Set your `CLUB_TIMEZONE` environment variable
2. The system will automatically detect and fix incorrectly stored timestamps
3. All new check-ins will use proper timezone handling
