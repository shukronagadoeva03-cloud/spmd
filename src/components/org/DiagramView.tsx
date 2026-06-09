export function DiagramView() {
  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white overflow-hidden">
      <div className="p-4 border-b border-zinc-200">
        <h2 className="text-lg font-semibold text-zinc-900">Организационная структура</h2>
        <p className="text-sm text-zinc-600 mt-1">
          Интерактивная схема организационной структуры компании
        </p>
      </div>
      <div className="w-full overflow-hidden">
        <iframe
          frameBorder={0}
          style={{ width: "100%", height: "800px", minHeight: "60vh" }}
          src="https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&dark=auto#R%3Cmxfile%3E%3Cdiagram%20name%3D%22%D0%9E%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%BD%D0%B0%D1%8F%20%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%82%D1%83%D1%80%D0%B0%22%20id%3D%22Y7Tqtv3Q2X-3mtH27Pn1%22%3E5VxLc6M4EP41PmYKvRAc%2FZxU7c5lU7WbOW0RI8fewSFFcB776xeDJDeWnNhalITYBwpaD3D3R%2FfXLdkDMl4%2Ffy%2BS%2B%2BWPPBXZAAfp84BMBhjjELGQVydb2UsjQyFCnDSy22KVSulOcLX6V0hhIKWbVSoeWh3LPM%2FK1X1bOM%2Fv7sS8bMmSosif2t0Weda%2B631yKwzB1TzJTOlfq7RcSikK433DpVjdLuWtIyy%2F8zpRneU3eVgmaf4ERGQ6IOMiz8vmbP08FtlWg0ovzbjZgVb9YIW4K48ZQP64nP65vv7524%2F1r%2FxncXn9%2BHd2gXDYzCNSQw%2B7iaXoId8Uc%2FHabAGWPcsXpcDtxFfyMi%2FKZX6b3yXZdCcdFfnmLhXbp0TV1a7P73l%2BL4X%2FiLJ8keBINmVeiZblOpOt803xWI8PqguJkaS4FeWrj0pctMXPVVvURVvRuWqLuWgr7lRbtD%2FaCh20RYJz1RZ30RY6V21FLtrC56qt2EVb5Ey1hVz4FqHnqi3koi12rtrCLtrqlst%2FEm2dqINuGfon0cExiHFh6KRThq5y9j5oy4Whk04ZunyEXmjLhaHTThl6n7DlwtBppwxdPkIvtOXC0GmnDL1P2HJh6PQUht4DHbhU7mi3vLs%2FvtupKky75d090pZLlkK75d090pZLlkK7Zeg90pYL56SdMnTcnxo6dvLynTL0PmnLJfvj%2FBga0P5CT8tVKa7uk1pzT0Vy3374ZvRjkm3kaCkQRSmewR3kY34X%2BVqUxUvVZQkWUUNJyJ7AiqtaRpWzXKCIRoq4vShZgEImZYlc%2BL3Vt9jppzqRKjpJXVHn6lrkd6WCk75ugFGlh831LFmvsu03vBTZoyhX86RqeCiL%2FJdekcbbrqssG%2BdZXtSPQW6SeZQS3RO0YEIpS622qiAXk%2B1xxOrjRJ2jQRTU581xVEvGqk91PqrPq7ev6UDrYwQGNhMOa0l9o9FUtroAJDYBokGjAII50qtEGiA05sgfQOLuAdK2qqg%2FhlVTsUg2WfkGoPDxgLK%2FypXVhggAoIFKWB%2BRhIcEAAJG58rc1XGmUFQNRwBjUyXR8IjcPAczgREYwAhibgKDhd6AoVD%2BTp6DmsAJ04iH1OYOyJBRgk70NVVXMMWi%2Fhz0KBoyGgVDBRMCmhoJboNC95mqIRHoEL7hq1wQFFlcS2S6Fh1n3glBR2XsPhGUBnMhsA1BLGSIi9MQZEcKDB5jw9pR20fAmAS8RgtEZmSygtEBJtTiaKjpaLglAjF%2FFCXCviNQykSUmo5kLwJ1GHFahGRqWE95h32KwgEQGIBV05MfBsgUoImC4SMnmFiYrN7a%2BIY3oR5hQr4eTGYAFNSABgat2lNoubLwG6y2W2iw2BkahCNv0KBfDxoUGB8pw0IvoFs%2FnxdAHjkF%2B3KmHmIjEExArjEDtoWs4XMHgiD2B4HQNwQEmUdBYKONoyBmdUuHOeteYhLUn4Ng0elDZWemzD4DCJoqJqrRgVUZo8lQg8EUbztXLgYH9fWYDGIu52pikjyOL5gTcLiFaDITOEQVwlv5CP7GvEGn%2B%2BLhh3uPOnuIa6sPyZ51jUwV2ZinUd3aUY1ZuzgGuQhkLRpb7%2BtkSODPyXiom340pWhMTdVxL1MNQHXi1NgSbLXddJPFNkhZOqunH4sLTPzh4pOUS7vExbhNNTUuDuUWTdjZq5KPgdlh0YsAcFE5iVPmYYYUFJu1C1uRlDJvAUU9wRdyE8MJcOmHahcRyEUYIKtDYPlPSEr9LaPEHmqdbSAsFgs8n9tIaRrehCz0V8aCtMCMDM2aikaDXibZK2AMFTWhgzhENp4yAdgJgYS1nQ4GoOOgAxzuxlpt6zCWBTqCTNbq08V4L4%2B%2Bf8SBOa2CSstZmMu3CnhHQW4o5W3IuUQdy6L%2BkVGH8MBfIhN7L4Z%2BJXeDbe4G%2BpFAga5XToeEoUeEea%2BpnoXbcct9%2FofbwXHsDRLea68f4XTMasYEmHemLP%2FmHpKOqKy58cP67uPI35vvv76KqqyG28wch5wkPsw8PFTwgKV2Xd7yXVinmhrAN9zcsRFwY7dg5fYjn8TCe4X0A4wfv1q6gp57V6UIWohwM7JpYn6ciSnlHk3svbS5iObC7sZvIrbdIuB%2Fz98bJt%2FbyQeL4%2Bb%2BLF0K74jeWaoVtk2fKPQHAe9VzGMh0P02zyEoWakXWi5tkV23eOxGzPAx77TVnP5WRDVnOC9zjjgQzl4l5kwF83c2OfZncu%2F1xo%2BI080KUm2tIT%2BctAcgWdvbJGUyt72kDwSCVrXAJcAf5dvtHC7w5dux%2Bsuxbn5OpJIBx58TbR2Dw8%2BJxPOqvN4O%2F8bk1U%2FQMnmWM9cXL4PTfnXUfCPTsoXIknL12NbZCeapLnf%2Fi1i3gb%2BYJNP%2FAA%3D%3D%3C%2Fdiagram%3E%3C%2Fmxfile%3E"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Организационная структура"
        />
      </div>
    </div>
  );
}
