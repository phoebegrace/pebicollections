'use client';

import {
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  usePathname
} from 'next/navigation';

const TRACKS = [
  {
    artist: 'aespa',

    src:
      'https://open.spotify.com/embed/track/3Fse9qXqMNey4TL5mLy8IF?utm_source=generator&autoplay=1'
  },

  {
    artist: 'BLACKPINK',

    src:
      'https://open.spotify.com/embed/track/1cdbkpZ3q1KYZDNSrOpdkb?utm_source=generator&autoplay=1'
  }
] as const;

const ROTATE_MS =
  180000;

export function MusicDrawer() {
  const pathname =
    usePathname();

  const initial =
    pathname
      .toLowerCase()
      .includes(
        'blackpink'
      )
      ? 1
      : 0;

  const [
    trackIndex,
    setTrackIndex
  ] = useState(initial);

  const [
    soundOn,
    setSoundOn
  ] = useState(true);

  useEffect(() => {
    if (!soundOn) {
      return;
    }

    const timer =
      window.setInterval(
        () => {
          setTrackIndex(
            index =>
              (index + 1) %
              TRACKS.length
          );
        },
        ROTATE_MS
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, [soundOn]);

  const track =
    useMemo(
      () =>
        TRACKS[
          trackIndex
        ],
      [trackIndex]
    );

  return (
    <aside
      className="music-drawer music-autoplay"
      aria-label="Pebicart soundtrack"
    >
      <div className="music-now">
        <span
          className="music-dot"
          aria-hidden="true"
        />

        <div>
          <small>
            now playing
          </small>

          <strong>
            {track.artist}
          </strong>
        </div>
      </div>

      {soundOn && (
        <iframe
          key={track.src}
          data-testid="embed-iframe"
          src={track.src}
          width="100%"
          height="80"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="eager"
          title={`${track.artist} Spotify track`}
        />
      )}

      <div className="music-controls">
        <button
          type="button"
          onClick={() =>
            setTrackIndex(
              index =>
                (index + 1) %
                TRACKS.length
            )
          }
        >
          next track
        </button>

        <button
          type="button"
          onClick={() =>
            setSoundOn(
              value =>
                !value
            )
          }
        >
          {soundOn
            ? 'sound off'
            : 'sound on'}
        </button>
      </div>
    </aside>
  );
}