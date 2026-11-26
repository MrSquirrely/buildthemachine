(() => {
    "use strict";

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
    const money = (n, digits = 2) => n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Data (edit freely) ---------- */

    // Set `image` to a file path (e.g. "images/hard-hat.jpg") to replace a placeholder.
    const PRODUCTS = [
        { id: "hat", name: "The \"Hammer Time\" Ceremonial Hard Hat", price: 49.99, note: "Meets zero OSHA standards.", image: "images/product-hat.jpg" },
        { id: "sign", name: "\"Safety Railings Kill Innovation\" Yard Sign 2-Pack", price: 35.00, note: "Includes flimsy wire stakes.", image: "images/product-sign.jpg" },
        { id: "pint", name: "The \"50,000 PSI\" Pint Glass", price: 24.50, note: "Marked with \"Fiscal Deficit\" and \"Full Sovereign Solvency\" fill lines.", image: "images/product-pint.jpg" },
        { id: "tumbler", name: "The \"Quiet Enjoyment\" Toddler-Free Tumbler", price: 42.00, note: "For peaceful airplane flights.", image: "images/product-tumbler.jpg" },
        { id: "tote", name: "\"Bipartisan Compromise\" Reversible Tote Bag", price: 28.00, note: "Side A: \"BUILD THE MACHINE NOW\" / Side B: \"FORM A BLUE-RIBBON COMMITTEE FIRST\".", image: "images/product-tote.jpg" },
        { id: "vote", name: "My Vote", price: 2500000.00, note: "One (1) Senate floor vote from Braxton, on the bill of your choice. Convictions sold separately. Bulk pricing available for private equity.", image: "images/product-vote.jpg" }
    ];

    const PAC_AMOUNT = 250000;
    const TIERS = [
        { amount: 5, name: "\"We Hear You\" Supporter", perk: "An automated thank-you email, after which we immediately sell your data to lobbyists.", influence: "0.0000%", known: "No", note: "You would need to give this amount 50,000 times. Federal law permits you to do so roughly 660 times." },
        { amount: 25, name: "\"Working-Class Backbone\"", perk: "A rain-soluble bumper sticker and a link to a fake community poll whose results are already printed.", influence: "0.0000%", known: "No", note: "The bar is there. Zoom in." },
        { amount: 100, name: "\"Founding Member\"", perk: "Access to a Livestream Town Hall with comments disabled.", influence: "0.0000%", known: "No", note: "Braxton thanks all nine thousand Founding Members equally." },
        { amount: 3300, name: "Legal Individual Max", perk: "Lukewarm hotel buffet sliders while Braxton is in the backroom with private equity.", influence: "0.0003%", known: "Briefly", note: "This is the most the law lets a person give. Fortunately, the law has other categories." },
        { amount: PAC_AMOUNT, plus: true, pac: true, name: "\"Actual Constituent\" Super PAC Tier", perk: "Unlimited dark money via Citizens for Industrial Youth Reduction. Includes legislative authorship and Braxton's personal cell number.", influence: "100%", known: "He named a turbine after you", note: "Welcome. Your draft of the bill is attached." }
    ];

    /* ---------- Mobile nav ---------- */

    const navToggle = $("#navToggle");
    const navLinks = $("#navLinks");
    navToggle.addEventListener("click", () => {
        const open = navLinks.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.addEventListener("click", (e) => {
        if (e.target.closest("a")) {
            navLinks.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
        }
    });

    /* ---------- Stat counters ---------- */

    const formatStat = (el, value) => {
        const text = el.dataset.format === "dec" ? value.toFixed(2) : Math.round(value).toLocaleString("en-US");
        el.textContent = (el.dataset.prefix ?? "") + text + (el.dataset.suffix ?? "");
    };
    const runCounter = (el) => {
        const to = Number(el.dataset.count);
        const from = Number(el.dataset.from ?? 0);
        if (reducedMotion) {
            formatStat(el, to);
            return;
        }
        const duration = 1800;
        const start = performance.now();
        const step = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            formatStat(el, from + ((to - from) * eased));
            if (t < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    };
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                runCounter(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    $$(".stat-num").forEach((el) => statObserver.observe(el));

    /* ---------- Tabs ---------- */

    const tabs = $$(".tab");
    const selectTab = (tab) => {
        tabs.forEach((t) => {
            const active = t === tab;
            t.setAttribute("aria-selected", String(active));
            t.tabIndex = active ? 0 : -1;
            $("#" + t.getAttribute("aria-controls")).hidden = !active;
        });
    };
    tabs.forEach((tab, i) => {
        tab.addEventListener("click", () => selectTab(tab));
        tab.addEventListener("keydown", (e) => {
            if ((e.key !== "ArrowRight") && (e.key !== "ArrowLeft")) {
                return;
            }
            const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
            selectTab(next);
            next.focus();
        });
    });

    /* ---------- Simulator ---------- */

    const hours = $("#hours");
    const updateSim = () => {
        const h = Number(hours.value);
        const fuel = h * 52 * 1840;
        const credits = h * 52 * 2.75;
        $("#hoursOut").textContent = h;
        $("#simFuel").textContent = money(fuel, 0);
        $("#simCredits").textContent = Math.round(credits).toLocaleString("en-US");
        $("#simRevenue").textContent = money(credits * 64, 0);
        $("#simStatus").textContent =
            h === 0 ? "Status: Idle. This is exactly what Washington wants."
            : h <= 16 ? "Status: Tuesdays & Thursdays Pilot Program. Undecided voters feel heard."
            : h <= 40 ? "Status: Standard shift. Union-approved, with two paid lubrication breaks."
            : h < 168 ? "Status: Overtime authorized. The bond market sends its regards."
            : "Status: Maximum Patriotic Uptime. The Acoustic Dampening Shroud has filed a grievance.";
    };
    hours.addEventListener("input", updateSim);
    updateSim();

    /* ---------- Modals ---------- */

    let lastFocus = null;
    const openModal = (id) => {
        lastFocus = document.activeElement;
        const modal = $("#" + id);
        modal.hidden = false;
        document.body.classList.add("locked");
        ($("input, select, button:not(.modal-close)", modal) ?? modal).focus();
    };
    const closeModals = () => {
        $$(".modal").forEach((m) => { m.hidden = true; });
        document.body.classList.remove("locked");
        lastFocus?.focus();
    };
    $$("[data-open-modal]").forEach((btn) => btn.addEventListener("click", () => {
        $("#volForm").hidden = false;
        $("#volDone").hidden = true;
        openModal(btn.dataset.openModal);
    }));
    $$("[data-close-modal]").forEach((btn) => btn.addEventListener("click", closeModals));
    $$(".modal").forEach((m) => m.addEventListener("click", (e) => {
        if (e.target === m) {
            closeModals();
        }
    }));

    $("#volForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const name = String(data.get("name")).trim() || "Patriot";
        $("#volDoneText").textContent = `Welcome aboard, ${name}. You've been assigned to: ${data.get("role")}.`;
        e.target.reset();
        e.target.hidden = true;
        $("#volDone").hidden = false;
    });

    /* ---------- Donation widget ---------- */

    const tiersEl = $("#tiers");
    const tierLabel = (t) => "$" + t.amount.toLocaleString("en-US") + (t.plus ? "+" : "");
    let currentTier = TIERS[1];

    const renderTiers = () => {
        tiersEl.innerHTML = "";
        TIERS.forEach((t) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "tier" + (t.pac ? " pac" : "");
            btn.setAttribute("role", "radio");
            btn.setAttribute("aria-checked", String(t === currentTier));
            const price = document.createElement("span");
            price.className = "tier-price";
            price.textContent = tierLabel(t);
            const name = document.createElement("span");
            name.className = "tier-name";
            name.textContent = t.name;
            btn.append(price, name);
            btn.addEventListener("click", () => {
                currentTier = t;
                renderTiers();
            });
            tiersEl.append(btn);
        });

        const t = currentTier;
        const pct = (t.amount / PAC_AMOUNT) * 100;
        $("#tierKicker").textContent = t.name;
        $("#tierAmount").textContent = tierLabel(t);
        $("#tierPerk").textContent = t.perk;
        $("#tierInfluence").textContent = t.influence;
        $("#tierName").textContent = t.known;
        $("#pacPct").textContent = t.pac ? "100%" : pct.toFixed(4) + "%";
        $("#pacBar").style.width = pct + "%";
        $("#pacBar").className = t.pac ? "bar-red" : "bar-amber";
        $("#pacNote").textContent = t.note;
        $("#donateBtn").textContent = t.pac ? "WIRE FUNDS DISCREETLY" : "CONTRIBUTE " + tierLabel(t);
    };
    renderTiers();

    $("#donateBtn").addEventListener("click", () => {
        $("#donText").textContent = currentTier.pac
            ? "Citizens for Industrial Youth Reduction thanks you. Braxton's cell number will arrive by courier."
            : `Your ${tierLabel(currentTier)} pledge as a ${currentTier.name} has been noted and rounded down.`;
        openModal("donateModal");
    });

    /* ---------- Store & cart ---------- */

    // Storage can be unavailable (private mode, blocked); the site works without it.
    const store = {
        get(area, key) {
            try {
                return window[area].getItem(key);
            }
            catch {
                return null;
            }
        },
        set(area, key, value) {
            try {
                window[area].setItem(key, value);
            }
            catch {
                // Ignored: persistence is optional.
            }
        }
    };

    const CART_KEY = "btm-cart";
    const loadCart = () => {
        try {
            const saved = JSON.parse(store.get("localStorage", CART_KEY) ?? "[]");
            return new Map(saved.filter(([id, qty]) => PRODUCTS.some((p) => p.id === id) && Number.isInteger(qty) && (qty > 0)));
        }
        catch {
            return new Map();
        }
    };
    const cart = loadCart();
    const productsEl = $("#products");

    PRODUCTS.forEach((p) => {
        const card = document.createElement("article");
        card.className = "product";

        let media;
        if (p.image) {
            media = document.createElement("img");
            media.className = "ph-img ph-square";
            media.src = p.image;
            media.alt = p.name;
            media.width = 800;
            media.height = 800;
            media.loading = "lazy";
        }
        else {
            media = document.createElement("div");
            media.className = "ph ph-square";
            media.dataset.label = "[Product Image Placeholder]";
            media.dataset.size = "600 × 600";
        }

        const body = document.createElement("div");
        body.className = "product-body";
        const title = document.createElement("h3");
        title.textContent = p.name;
        const note = document.createElement("p");
        note.className = "product-note";
        note.textContent = p.note;
        const foot = document.createElement("div");
        foot.className = "product-foot";
        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = money(p.price);
        const add = document.createElement("button");
        add.className = "btn btn-navy btn-sm";
        add.textContent = "Add to Cart";
        add.addEventListener("click", () => {
            cart.set(p.id, (cart.get(p.id) ?? 0) + 1);
            renderCart();
            add.textContent = "Added ✓";
            setTimeout(() => { add.textContent = "Add to Cart"; }, 1100);
        });
        foot.append(price, add);
        body.append(title, note, foot);
        card.append(media, body);
        productsEl.append(card);
    });

    const cartDrawer = $("#cartDrawer");
    const cartOverlay = $("#cartOverlay");
    const cartCount = $("#cartCount");

    const renderCart = () => {
        const itemsEl = $("#cartItems");
        itemsEl.innerHTML = "";
        let total = 0;
        let count = 0;

        cart.forEach((qty, id) => {
            const p = PRODUCTS.find((x) => x.id === id);
            total += p.price * qty;
            count += qty;

            const row = document.createElement("div");
            row.className = "cart-item";
            const name = document.createElement("div");
            name.className = "cart-item-name";
            name.textContent = p.name;
            const price = document.createElement("div");
            price.className = "cart-item-price";
            price.textContent = money(p.price * qty);

            const qtyEl = document.createElement("div");
            qtyEl.className = "qty";
            const minus = document.createElement("button");
            minus.textContent = "−";
            minus.setAttribute("aria-label", "Decrease quantity");
            const num = document.createElement("span");
            num.textContent = qty;
            const plus = document.createElement("button");
            plus.textContent = "+";
            plus.setAttribute("aria-label", "Increase quantity");
            const setQty = (n) => {
                if (n <= 0) {
                    cart.delete(id);
                }
                else {
                    cart.set(id, n);
                }
                renderCart();
            };
            minus.addEventListener("click", () => setQty(qty - 1));
            plus.addEventListener("click", () => setQty(qty + 1));
            qtyEl.append(minus, num, plus);

            const remove = document.createElement("button");
            remove.className = "cart-remove";
            remove.textContent = "Remove";
            remove.addEventListener("click", () => setQty(0));

            row.append(name, price, qtyEl, remove);
            itemsEl.append(row);
        });

        if (count === 0) {
            const empty = document.createElement("p");
            empty.className = "cart-empty";
            empty.textContent = "Your cart is empty. So is the municipal treasury. Only one of these is your fault.";
            itemsEl.append(empty);
        }

        store.set("localStorage", CART_KEY, JSON.stringify([...cart]));
        $("#cartTotal").textContent = money(total);
        $("#cartMsg").textContent = "";
        if (cartCount.textContent !== String(count)) {
            cartCount.textContent = count;
            cartCount.classList.remove("bump");
            void cartCount.offsetWidth;
            cartCount.classList.add("bump");
        }
    };

    const setCartOpen = (open) => {
        cartDrawer.classList.toggle("open", open);
        cartDrawer.setAttribute("aria-hidden", String(!open));
        cartOverlay.hidden = !open;
        document.body.classList.toggle("locked", open);
        if (open) {
            navLinks.classList.remove("open");
            $("#cartClose").focus();
        }
    };
    $("#cartOpen").addEventListener("click", () => setCartOpen(true));
    $("#cartClose").addEventListener("click", () => setCartOpen(false));
    cartOverlay.addEventListener("click", () => setCartOpen(false));
    $("#checkoutBtn").addEventListener("click", () => {
        $("#cartMsg").textContent = cart.size === 0
            ? "Add something first. The Machine won't fund itself."
            : "Checkout is disabled because this store is satire. No order was placed and nothing was charged.";
    });
    renderCart();

    /* ---------- Keyboard: Escape closes, Tab stays inside the open dialog ---------- */

    const FOCUSABLE = "a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex='-1'])";
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModals();
            setCartOpen(false);
            return;
        }
        if (e.key !== "Tab") {
            return;
        }
        const container = $(".modal:not([hidden])") ?? $(".drawer.open");
        if (!container) {
            return;
        }
        const items = $$(FOCUSABLE, container).filter((el) => el.offsetParent !== null);
        if (items.length === 0) {
            return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        if (!container.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
        }
        else if (e.shiftKey && (document.activeElement === first)) {
            e.preventDefault();
            last.focus();
        }
        else if (!e.shiftKey && (document.activeElement === last)) {
            e.preventDefault();
            first.focus();
        }
    });

    /* ---------- Events RSVP ---------- */

    $$("[data-rsvp]").forEach((btn) => btn.addEventListener("click", () => {
        btn.textContent = "Waitlisted Behind Donors";
        btn.disabled = true;
    }));

    /* ---------- Cookie banner ---------- */

    const cookieBanner = $("#cookieBanner");
    if (!store.get("localStorage", "btm-cookie")) {
        cookieBanner.hidden = false;
    }
    $$("[data-cookie]").forEach((btn) => btn.addEventListener("click", () => {
        store.set("localStorage", "btm-cookie", "1");
        cookieBanner.hidden = true;
    }));

    /* ---------- Email signup pop-up (once per visit: after 30s or on exit intent) ---------- */

    const SIGNUP_KEY = "btm-signup-shown";
    const showSignup = () => {
        const busy = $(".modal:not([hidden])") || cartDrawer.classList.contains("open");
        if (store.get("sessionStorage", SIGNUP_KEY) || busy) {
            return;
        }
        store.set("sessionStorage", SIGNUP_KEY, "1");
        $("#signForm").hidden = false;
        $("#signDone").hidden = true;
        openModal("signupModal");
    };
    setTimeout(showSignup, 30000);
    document.addEventListener("mouseout", (e) => {
        if (!e.relatedTarget && (e.clientY <= 0)) {
            showSignup();
        }
    });
    $("#signForm").addEventListener("submit", (e) => {
        e.preventDefault();
        e.target.reset();
        e.target.hidden = true;
        $("#signDone").hidden = false;
    });
})();
