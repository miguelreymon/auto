const SPAIN_PROVINCES = [
  { slug: 'madrid', name: 'Madrid', url: 'https://milpasiones.com/escorts/madrid-provincia/madrid/' },
  { slug: 'barcelona', name: 'Barcelona', url: 'https://milpasiones.com/escorts/barcelona-provincia/barcelona/' },
  { slug: 'valencia', name: 'Valencia', url: 'https://milpasiones.com/escorts/valencia-provincia/valencia/' },
  { slug: 'alicante', name: 'Alicante', url: 'https://milpasiones.com/escorts/alicante-provincia/alicante/' },
  { slug: 'malaga', name: 'Málaga', url: 'https://milpasiones.com/escorts/malaga-provincia/malaga/' },
  { slug: 'sevilla', name: 'Sevilla', url: 'https://milpasiones.com/escorts/sevilla-provincia/sevilla/' },
  { slug: 'murcia', name: 'Murcia', url: 'https://milpasiones.com/escorts/murcia-provincia/murcia/' },
  { slug: 'baleares', name: 'Baleares (Mallorca/Ibiza)', url: 'https://milpasiones.com/escorts/baleares/palma-de-mallorca/' },
  { slug: 'zaragoza', name: 'Zaragoza', url: 'https://milpasiones.com/escorts/zaragoza-provincia/zaragoza/' },
  { slug: 'vizcaya', name: 'Bilbao (Vizcaya)', url: 'https://milpasiones.com/escorts/vizcaya/bilbao/' },
  { slug: 'las-palmas', name: 'Las Palmas', url: 'https://milpasiones.com/escorts/las-palmas/las-palmas-de-gran-canaria/' },
  { slug: 'santa-cruz-de-tenerife', name: 'Tenerife', url: 'https://milpasiones.com/escorts/santa-cruz-de-tenerife/santa-cruz-de-tenerife/' },
  { slug: 'granada', name: 'Granada', url: 'https://milpasiones.com/escorts/granada-provincia/granada/' },
  { slug: 'cadiz', name: 'Cádiz', url: 'https://milpasiones.com/escorts/cadiz-provincia/cadiz/' },
  { slug: 'a-coruna', name: 'A Coruña', url: 'https://milpasiones.com/escorts/a-coruna-provincia/a-coruna/' },
  { slug: 'asturias', name: 'Asturias (Oviedo/Gijón)', url: 'https://milpasiones.com/escorts/asturias/oviedo/' },
  { slug: 'valladolid', name: 'Valladolid', url: 'https://milpasiones.com/escorts/valladolid-provincia/valladolid/' },
  { slug: 'castellon', name: 'Castellón', url: 'https://milpasiones.com/escorts/castellon/castellon-de-la-plana/' },
  { slug: 'tarragona', name: 'Tarragona', url: 'https://milpasiones.com/escorts/tarragona-provincia/tarragona/' },
  { slug: 'girona', name: 'Girona', url: 'https://milpasiones.com/escorts/girona-provincia/girona/' },
  { slug: 'almeria', name: 'Almería', url: 'https://milpasiones.com/escorts/almeria-provincia/almeria/' },
  { slug: 'cordoba', name: 'Córdoba', url: 'https://milpasiones.com/escorts/cordoba-provincia/cordoba/' },
  { slug: 'toledo', name: 'Toledo', url: 'https://milpasiones.com/escorts/toledo-provincia/toledo/' },
  { slug: 'badajoz', name: 'Badajoz', url: 'https://milpasiones.com/escorts/badajoz-provincia/badajoz/' },
  { slug: 'cantabria', name: 'Cantabria (Santander)', url: 'https://milpasiones.com/escorts/cantabria/santander/' }
];

function generateMovementHistory(currentRank: number, lastEditedTime: string, checkedTime: string) {
  const current = currentRank || 1;
  const points = [];

  points.push({
    timeLabel: lastEditedTime || 'Renovado',
    rank: 1,
    rankWithAutoPubli: 1,
    label: 'Subida manual al Puesto #1',
    isCurrent: current === 1,
    isProjected: false,
  });

  if (current > 1) {
    const p1Rank = Math.max(2, Math.round(current * 0.35));
    points.push({
      timeLabel: '+20 min',
      rank: p1Rank,
      rankWithAutoPubli: 1,
      label: `Desplazado al puesto #${p1Rank}`,
      isCurrent: false,
      isProjected: false,
    });

    const p2Rank = Math.max(p1Rank + 1, Math.round(current * 0.7));
    points.push({
      timeLabel: '+45 min',
      rank: p2Rank,
      rankWithAutoPubli: 1,
      label: `Caída al puesto #${p2Rank}`,
      isCurrent: false,
      isProjected: false,
    });

    points.push({
      timeLabel: `Ahora (${checkedTime})`,
      rank: current,
      rankWithAutoPubli: 1,
      label: `Auditado ahora (Puesto #${current})`,
      isCurrent: true,
      isProjected: false,
    });
  }

  const projRank1 = Math.min(45, Math.round(current * 1.5 + 4));
  points.push({
    timeLabel: '+1h',
    rank: projRank1,
    rankWithAutoPubli: 1,
    label: `Proyección sin renovar (#${projRank1})`,
    isCurrent: false,
    isProjected: true,
  });

  const projRank2 = Math.min(75, Math.round(current * 2.2 + 10));
  points.push({
    timeLabel: '+3h',
    rank: projRank2,
    rankWithAutoPubli: 1,
    label: `Caída profunda (#${projRank2})`,
    isCurrent: false,
    isProjected: true,
  });

  return points;
}

// Helper para rastrear páginas cronológicas reales (1 a 6) ignorando carruseles VIP superiores
async function crawlCategoryPages(
  baseUrl: string,
  categoryUrl: string,
  cleanPhone: string,
  userAgent: string,
  maxPages = 6
) {
  const pageNumbers = Array.from({ length: maxPages }, (_, i) => i + 1);
  const pagesData = await Promise.all(
    pageNumbers.map(async (p) => {
      const pUrl = p === 1 ? categoryUrl : `${categoryUrl}${categoryUrl.includes('?') ? '&' : '?'}pag=${p}`;
      try {
        const res = await fetch(pUrl, { headers: { 'User-Agent': userAgent } });
        const html = await res.text();
        return { pageNum: p, url: pUrl, html };
      } catch {
        return { pageNum: p, url: pUrl, html: '' };
      }
    })
  );

  let regularMatch: {
    page: number;
    positionInPage: number;
    rank: number;
    date: string;
    pageUrl: string;
    isVip: boolean;
  } | null = null;

  let vipMatch: {
    page: number;
    positionInPage: number;
    rank: number;
    date: string;
    pageUrl: string;
    isVip: boolean;
    url?: string;
    title?: string;
    image?: string | null;
  } | null = null;

  const allMatches: {
    page: number;
    positionInPage: number;
    rank: number;
    date: string;
    pageUrl: string;
    isVip: boolean;
    url: string;
    title: string;
    image: string | null;
  }[] = [];
  const seenUrls = new Set<string>();

  for (const page of pagesData) {
    if (!page.html) continue;

    const items = page.html.split('<li class="itemList').slice(1);

    for (let idx = 0; idx < items.length; idx++) {
      const chunk = items[idx];
      if (chunk.includes(cleanPhone)) {
        const isVip = chunk.includes('vip');
        const dateMatch = chunk.match(/<span class="info_date">([^<]+)<\/span>/);
        const hrefMatch = chunk.match(/href="([^"]*\/anuncio\/[^"]+)"/i);
        const titleMatch = chunk.match(/title="([^"]+)"/i) || chunk.match(/<h2[^>]*>([^<]+)<\/h2>/i);
        const imgMatch = chunk.match(/<img[^>]*src="([^"]+)"/i) || chunk.match(/<img[^>]*data-src="([^"]+)"/i);

        const rawUrl = hrefMatch ? hrefMatch[1] : '';
        const fullUrl = rawUrl ? (rawUrl.startsWith('http') ? rawUrl : `${baseUrl}${rawUrl}`) : '';
        const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
        let image = imgMatch ? imgMatch[1] : null;
        if (image && !image.startsWith('http')) {
          image = `${baseUrl}${image}`;
        }

        const matchData = {
          page: page.pageNum,
          positionInPage: idx + 1,
          rank: (page.pageNum - 1) * 40 + (idx + 1),
          date: dateMatch ? dateMatch[1].trim() : '',
          pageUrl: page.url,
          isVip,
          url: fullUrl,
          title,
          image,
        };

        if (fullUrl && !seenUrls.has(fullUrl)) {
          seenUrls.add(fullUrl);
          allMatches.push(matchData);
        }

        if (!isVip && !regularMatch) {
          regularMatch = matchData;
        }
        if (isVip && !vipMatch) {
          vipMatch = matchData;
        }
      }
    }
  }

  const chosen = regularMatch || vipMatch || (allMatches.length > 0 ? allMatches[0] : null);
  return {
    chosen,
    allMatches,
    hasVipPlacement: Boolean(vipMatch),
    isRegular: Boolean(regularMatch),
  };
}

async function scrapeMilpasionesPhone(cleanPhone: string, selectedProvinceSlug?: string) {
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
  const adUrlRegex = new RegExp(`(?:https?:\\/\\/milpasiones\\.com)?(\\/anuncio\\/${cleanPhone}-[a-zA-Z0-9_-]+_[0-9]+\\/)`, 'i');

  try {
    let matchedAdPath: string | null = null;
    let foundCityInfo: { name: string; url: string } | null = null;

    try {
      const searchUrl = `https://milpasiones.com/?s=${cleanPhone}`;
      const searchRes = await fetch(searchUrl, { headers: { 'User-Agent': userAgent } });
      const searchHtml = await searchRes.text();
      const match = searchHtml.match(adUrlRegex);
      if (match) matchedAdPath = match[1];
    } catch {}

    if (!matchedAdPath) {
      const topProvinces = SPAIN_PROVINCES.slice(0, 25);
      const responses = await Promise.all(
        topProvinces.map(async (prov) => {
          try {
            const res = await fetch(prov.url, { headers: { 'User-Agent': userAgent } });
            const html = await res.text();
            const match = html.match(adUrlRegex);
            return { prov, match, html };
          } catch {
            return { prov, match: null, html: '' };
          }
        })
      );

      for (const item of responses) {
        if (item.match) {
          matchedAdPath = item.match[1];
          foundCityInfo = item.prov;
          break;
        }
      }
    }

    if (!matchedAdPath) return null;

    const adUrl = matchedAdPath.startsWith('http') ? matchedAdPath : `https://milpasiones.com${matchedAdPath}`;
    const adRes = await fetch(adUrl, { headers: { 'User-Agent': userAgent } });
    const adHtml = await adRes.text();

    const titleMatch = adHtml.match(/<h1[^>]*class="[^"]*product_name[^"]*"[^>]*>([\s\S]*?)<\/h1>/i) || adHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Anuncio en MilPasiones';

    const photoMatch = adHtml.match(/<img[^>]*src="([^"]*\/src\/photos\/[^"]+)"/i) || adHtml.match(/<img[^>]*class="[^"]*img-fluid[^"]*"[^>]*src="([^"]+)"/i);
    const image = photoMatch ? (photoMatch[1].startsWith('http') ? photoMatch[1] : `https://milpasiones.com${photoMatch[1]}`) : null;

    let publishedDate = 'Hoy';
    let lastEditedTime = 'Hoy';
    const dateSpanMatch = adHtml.match(/<span class="info_date">([\s\S]*?)<\/span>/i);
    if (dateSpanMatch) {
      const dateText = dateSpanMatch[1].replace(/<[^>]+>/g, ' | ');
      const pubMatch = dateText.match(/Publicado:\s*([0-9]{2}:[0-9]{2}\s+[0-9]{2}\/[0-9]{2}\/[0-9]{4})/i) || dateText.match(/Publicado:\s*([0-9]{2}:[0-9]{2})/i);
      if (pubMatch) publishedDate = pubMatch[1].trim();

      const editMatch = dateText.match(/Editado:\s*([0-9]{2}:[0-9]{2})/i);
      if (editMatch) lastEditedTime = editMatch[1].trim();
      else if (pubMatch) lastEditedTime = pubMatch[1].split(' ')[0].trim();
    }

    const breadcrumbLinks = [...adHtml.matchAll(/<li[^>]*class="[^"]*bread-item[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/gi)];
    let categoryName = foundCityInfo ? foundCityInfo.name : 'MilPasiones';
    let categoryUrl: string = foundCityInfo ? foundCityInfo.url : 'https://milpasiones.com/escorts/valencia-provincia/valencia/';

    if (breadcrumbLinks.length > 0) {
      const lastBreadcrumb = breadcrumbLinks[breadcrumbLinks.length - 1];
      categoryUrl = lastBreadcrumb[1].startsWith('http') ? lastBreadcrumb[1] : `https://milpasiones.com${lastBreadcrumb[1]}`;
      categoryName = lastBreadcrumb[2].trim();
    }

    const crawlResult = await crawlCategoryPages('https://milpasiones.com', categoryUrl, cleanPhone, userAgent, 6);

    let rank = 1;
    let pageFound = 1;
    let positionInPage = 1;
    let pageUrl = categoryUrl;
    let isEstimated = false;

    if (crawlResult.chosen) {
      pageFound = crawlResult.chosen.page;
      positionInPage = crawlResult.chosen.positionInPage;
      rank = crawlResult.chosen.rank;
      pageUrl = crawlResult.chosen.pageUrl;
      if (crawlResult.chosen.date) {
        lastEditedTime = crawlResult.chosen.date;
      }
    } else {
      isEstimated = true;
      pageFound = 7;
      positionInPage = 20;
      rank = 260;
      pageUrl = `${categoryUrl}${categoryUrl.includes('?') ? '&' : '?'}pag=7`;
    }

    const checkedTime = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const movementHistory = generateMovementHistory(rank, lastEditedTime, checkedTime);

    let visibilityScore = 10;
    let status: 'podium' | 'medium' | 'invisible' = 'invisible';
    let statusText = isEstimated ? '⛔ Fuera de Pág. 6 (>240 anuncios)' : `⛔ Zona Invisible (Página ${pageFound})`;

    if (rank <= 3) {
      visibilityScore = 95;
      status = 'podium';
      statusText = '🔥 Puesto de Honor (Top 3)';
    } else if (rank <= 12) {
      visibilityScore = 70;
      status = 'medium';
      statusText = '⚠️ Visibilidad Media (Página 1)';
    } else if (rank <= 40) {
      visibilityScore = 40;
      status = 'medium';
      statusText = '🚨 Final de Página 1 (Poco tráfico)';
    } else if (pageFound === 2) {
      visibilityScore = 20;
      status = 'invisible';
      statusText = '⛔ Zona Invisible (Página 2)';
    } else {
      visibilityScore = Math.max(3, Math.round(15 / pageFound));
      status = 'invisible';
      statusText = isEstimated ? '⛔ Hundido (>Pág. 6 · Sin renovar)' : `⛔ Zona Invisible (Página ${pageFound})`;
    }

    const additionalAds: {
      url: string;
      title: string;
      image: string | null;
      city: string;
      category?: string;
      rank?: number | null;
      page?: number | null;
      lastEditedTime?: string;
      isCensored: boolean;
    }[] = [];

    if (crawlResult.allMatches && crawlResult.allMatches.length > 0) {
      for (const m of crawlResult.allMatches) {
        if (m.url && m.url !== adUrl && !additionalAds.some((a) => a.url === m.url)) {
          additionalAds.push({
            url: m.url,
            title: m.title || title,
            image: m.image || image,
            city: categoryName.replace(/^Escorts\s+/i, '').trim(),
            category: categoryName,
            rank: m.rank,
            page: m.page,
            lastEditedTime: m.date || lastEditedTime,
            isCensored: true,
          });
        }
      }
    }

    return {
      portalId: 'milpasiones',
      portalName: 'MilPasiones.com',
      portalUrl: 'https://milpasiones.com/',
      logoUrl: '/logos/milpasiones.png',
      badgeColor: 'bg-rose-500 text-white',
      url: adUrl,
      title,
      image,
      city: categoryName.replace(/^Escorts\s+/i, '').trim(),
      category: categoryName,
      categoryUrl,
      pageUrl,
      rank,
      page: pageFound,
      positionInPage,
      visibilityScore,
      status,
      statusText,
      publishedDate,
      lastEditedTime,
      checkedAt: checkedTime,
      movementHistory,
      hasVipPlacement: crawlResult.hasVipPlacement,
      isEstimated,
      additionalAds,
    };
  } catch (e) {
    return null;
  }
}

async function scrapePasionValenciaPhone(cleanPhone: string) {
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
  const adUrlRegex = new RegExp(`(?:https?:\\/\\/pasionvalencia\\.es)?(\\/anuncio\\/${cleanPhone}-[a-zA-Z0-9_-]+_[0-9]+\\/)`, 'i');

  try {
    let matchedAdPath: string | null = null;

    try {
      const searchUrl = `https://pasionvalencia.es/buscar-${cleanPhone}/contactos/`;
      const searchRes = await fetch(searchUrl, { headers: { 'User-Agent': userAgent } });
      const searchHtml = await searchRes.text();
      const match = searchHtml.match(adUrlRegex);
      if (match) {
        matchedAdPath = match[1];
      }
    } catch {}

    if (!matchedAdPath) {
      try {
        const sUrl = `https://pasionvalencia.es/?s=${cleanPhone}`;
        const sRes = await fetch(sUrl, { headers: { 'User-Agent': userAgent } });
        const sHtml = await sRes.text();
        const match = sHtml.match(adUrlRegex);
        if (match) {
          matchedAdPath = match[1];
        }
      } catch {}
    }

    if (!matchedAdPath) {
      const listUrls = [
        'https://pasionvalencia.es/',
        'https://pasionvalencia.es/escorts/valencia-ciudad/',
        'https://pasionvalencia.es/escorts/',
        'https://pasionvalencia.es/contactos/'
      ];

      for (let i = 0; i < listUrls.length; i++) {
        try {
          const res = await fetch(listUrls[i], { headers: { 'User-Agent': userAgent } });
          const html = await res.text();
          const match = html.match(adUrlRegex);
          if (match) {
            matchedAdPath = match[1];
            break;
          }
        } catch {}
      }
    }

    if (!matchedAdPath) return null;

    const adUrl = matchedAdPath.startsWith('http') ? matchedAdPath : `https://pasionvalencia.es${matchedAdPath}`;
    const adRes = await fetch(adUrl, { headers: { 'User-Agent': userAgent } });
    const adHtml = await adRes.text();

    const titleMatch = adHtml.match(/<h1[^>]*class="[^"]*product_name[^"]*"[^>]*>([\s\S]*?)<\/h1>/i) || adHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Anuncio en PasionValencia';

    const photoMatch = adHtml.match(/<img[^>]*src="([^"]*\/src\/photos\/[^"]+)"/i) || adHtml.match(/<img[^>]*class="[^"]*img-fluid[^"]*"[^>]*src="([^"]+)"/i);
    const image = photoMatch ? (photoMatch[1].startsWith('http') ? photoMatch[1] : `https://pasionvalencia.es${photoMatch[1]}`) : null;

    let publishedDate = 'Hoy';
    let lastEditedTime = 'Hoy';
    const dateSpanMatch = adHtml.match(/<span class="info_date">([\s\S]*?)<\/span>/i);
    if (dateSpanMatch) {
      const dateText = dateSpanMatch[1].replace(/<[^>]+>/g, ' | ');
      const pubMatch = dateText.match(/Publicado:\s*([0-9]{2}:[0-9]{2}\s+[0-9]{2}\/[0-9]{2}\/[0-9]{4})/i) || dateText.match(/Publicado:\s*([0-9]{2}:[0-9]{2})/i);
      if (pubMatch) publishedDate = pubMatch[1].trim();

      const editMatch = dateText.match(/Editado:\s*([0-9]{2}:[0-9]{2})/i);
      if (editMatch) lastEditedTime = editMatch[1].trim();
      else if (pubMatch) lastEditedTime = pubMatch[1].split(' ')[0].trim();
    }

    const breadcrumbLinks = [...adHtml.matchAll(/<li[^>]*class="[^"]*bread-item[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/gi)];
    let categoryName = 'Valencia';
    let categoryUrl = 'https://pasionvalencia.es/escorts/valencia-ciudad/';

    if (breadcrumbLinks.length > 0) {
      const lastBreadcrumb = breadcrumbLinks[breadcrumbLinks.length - 1];
      categoryUrl = lastBreadcrumb[1].startsWith('http') ? lastBreadcrumb[1] : `https://pasionvalencia.es${lastBreadcrumb[1]}`;
      categoryName = lastBreadcrumb[2].trim();
    }

    const crawlResult = await crawlCategoryPages('https://pasionvalencia.es', categoryUrl, cleanPhone, userAgent, 6);

    let rank = 1;
    let pageFound = 1;
    let positionInPage = 1;
    let pageUrl = categoryUrl;
    let isEstimated = false;

    if (crawlResult.chosen) {
      pageFound = crawlResult.chosen.page;
      positionInPage = crawlResult.chosen.positionInPage;
      rank = crawlResult.chosen.rank;
      pageUrl = crawlResult.chosen.pageUrl;
      if (crawlResult.chosen.date) {
        lastEditedTime = crawlResult.chosen.date;
      }
    } else {
      isEstimated = true;
      pageFound = 7;
      positionInPage = 20;
      rank = 260;
      pageUrl = `${categoryUrl}${categoryUrl.includes('?') ? '&' : '?'}pag=7`;
    }

    const checkedTime = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const movementHistory = generateMovementHistory(rank, lastEditedTime, checkedTime);

    let visibilityScore = 10;
    let status: 'podium' | 'medium' | 'invisible' = 'invisible';
    let statusText = isEstimated ? '⛔ Fuera de Pág. 6 (>240 anuncios)' : `⛔ Zona Invisible (Página ${pageFound})`;

    if (rank <= 3) {
      visibilityScore = 95;
      status = 'podium';
      statusText = '🔥 Puesto de Honor (Top 3)';
    } else if (rank <= 12) {
      visibilityScore = 70;
      status = 'medium';
      statusText = '⚠️ Visibilidad Media (Página 1)';
    } else if (rank <= 40) {
      visibilityScore = 40;
      status = 'medium';
      statusText = '🚨 Final de Página 1 (Poco tráfico)';
    } else if (pageFound === 2) {
      visibilityScore = 20;
      status = 'invisible';
      statusText = '⛔ Zona Invisible (Página 2)';
    } else {
      visibilityScore = Math.max(3, Math.round(15 / pageFound));
      status = 'invisible';
      statusText = isEstimated ? '⛔ Hundido (>Pág. 6 · Sin renovar)' : `⛔ Zona Invisible (Página ${pageFound})`;
    }

    const additionalAds: {
      url: string;
      title: string;
      image: string | null;
      city: string;
      category?: string;
      rank?: number | null;
      page?: number | null;
      lastEditedTime?: string;
      isCensored: boolean;
    }[] = [];

    if (crawlResult.allMatches && crawlResult.allMatches.length > 0) {
      for (const m of crawlResult.allMatches) {
        if (m.url && m.url !== adUrl && !additionalAds.some((a) => a.url === m.url)) {
          additionalAds.push({
            url: m.url,
            title: m.title || title,
            image: m.image || image,
            city: categoryName.replace(/^Escorts\s+/i, '').trim() || 'Valencia',
            category: categoryName,
            rank: m.rank,
            page: m.page,
            lastEditedTime: m.date || lastEditedTime,
            isCensored: true,
          });
        }
      }
    }

    return {
      portalId: 'pasionvalencia',
      portalName: 'PasionValencia.es',
      portalUrl: 'https://pasionvalencia.es/',
      logoUrl: '/logos/pasionvalencia.png',
      badgeColor: 'bg-orange-600 text-white',
      url: adUrl,
      title,
      image,
      city: categoryName.replace(/^Escorts\s+/i, '').trim() || 'Valencia',
      category: categoryName,
      categoryUrl,
      pageUrl,
      rank,
      page: pageFound,
      positionInPage,
      visibilityScore,
      status,
      statusText,
      publishedDate,
      lastEditedTime,
      checkedAt: checkedTime,
      movementHistory,
      hasVipPlacement: crawlResult.hasVipPlacement,
      isEstimated,
      additionalAds,
    };
  } catch (e) {
    return null;
  }
}

export default async function handler(req: any, res: any) {
  const phoneInput = (req.query?.phone as string) || '';
  const province = (req.query?.province as string) || '';

  if (!phoneInput) {
    return res.status(400).json({ found: false, message: 'Falta el parámetro phone' });
  }

  let cleanPhone = '';
  if (phoneInput.includes('/anuncio/')) {
    const urlMatch = phoneInput.match(/\/anuncio\/([0-9]{9})-/);
    if (urlMatch) cleanPhone = urlMatch[1];
  }

  if (!cleanPhone) {
    cleanPhone = phoneInput.replace(/\D/g, '').replace(/^34/, '');
  }

  if (!cleanPhone || cleanPhone.length < 9) {
    return res.status(200).json({
      found: false,
      phone: cleanPhone,
      message: 'Introduce un número de teléfono válido de 9 dígitos.',
    });
  }

  cleanPhone = cleanPhone.slice(-9);

  const [adMP, adPV] = await Promise.all([
    scrapeMilpasionesPhone(cleanPhone, province),
    scrapePasionValenciaPhone(cleanPhone)
  ]);

  const portalsFound = [];
  if (adMP) portalsFound.push(adMP);
  if (adPV) portalsFound.push(adPV);

  if (portalsFound.length === 0) {
    return res.status(200).json({
      found: false,
      phone: cleanPhone,
      message: 'No localizamos ningún anuncio activo con este teléfono ni en MilPasiones.com ni en PasionValencia.es.',
    });
  }

  return res.status(200).json({
    found: true,
    phone: cleanPhone,
    totalPortalsFound: portalsFound.length,
    portals: portalsFound,
    ad: portalsFound[0],
  });
}
