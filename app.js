/* ==========================================================================
   K2 CONSTRUCTION GROUP DASHBOARD APP LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // App State & Configuration
  // ==========================================
  const state = {
    activeTab: 'dashboard',
    selectedProject: '1234 - Sunset Waterfront Residence',
    activeDrawing: 'structural', // structural, architectural, mep, civil
    searchQuery: '',
    
    // Canvas Pan & Zoom State
    canvas: {
      scale: 1.0,
      translateX: 0,
      translateY: 0,
      isDragging: false,
      startX: 0,
      startY: 0,
      mode: 'pan', // 'pan' or 'select'
      activeTool: 'select', // select, comment, draw, cloud, measure, links, layers
    },
    
    // Dashboard Mini Checklist Data
    tasks: [
      { id: 1, text: 'Install Drywall - Level 2', time: '8:00 AM', priority: 'High', completed: false },
      { id: 2, text: 'HVAC Inspection', time: '10:00 AM', priority: 'Medium', completed: false },
      { id: 3, text: 'Paint - Bedroom 3', time: '1:00 PM', priority: 'Medium', completed: false },
      { id: 4, text: 'Electrical Testing', time: '3:00 PM', priority: 'Low', completed: false },
      { id: 5, text: 'Site Cleanup', time: '4:00 PM', priority: 'Low', completed: false }
    ],
    
    // Detailed Tasks Page Data (from Mockup Page 11 & roadmap)
    detailedTasks: [
      { id: 101, title: 'Inspector follow-up — rough electrical sign-off', project: 'Whitman Residence', room: 'Wine Room', assignee: 'Jamal', due: 'Tomorrow', priority: 'High', status: 'open' },
      { id: 102, title: 'Owner walkthrough — cabinet sample', project: 'Whitman Residence', room: 'Kitchen', assignee: 'Sasha', due: 'In 4d', priority: 'High', status: 'open' },
      { id: 103, title: 'Submit progress invoice #6', project: 'Whitman Residence', room: 'Project-level', assignee: 'Beata', due: 'In 6d', priority: 'High', status: 'open' },
      { id: 104, title: 'Owner kitchen sample meeting', project: 'Whitman Residence', room: 'Kitchen', assignee: 'Sasha', due: 'In 30d', priority: 'High', status: 'open' },
      { id: 105, title: 'Confirm fireplace surround — soapstone or limestone', project: 'Whitman Residence', room: 'Family Room', assignee: 'Sasha', due: 'Jun 5', priority: 'Medium', status: 'open' },
      { id: 106, title: 'Pool house — exterior trim direction', project: 'Whitman Residence', room: 'Pool House', assignee: 'Sasha', due: 'Jun 12', priority: 'Medium', status: 'open' },
      { id: 107, title: 'Spec cooling unit (WhisperKool)', project: 'Whitman Residence', room: 'Wine Room', assignee: 'Marcus', due: 'Jun 20', priority: 'Medium', status: 'open' },
      { id: 108, title: 'Order shower glass — measure after tile', project: 'Whitman Residence', room: 'Primary Bath', assignee: 'Rafael', due: 'Jun 22', priority: 'Medium', status: 'open' },
      { id: 109, title: 'Submit DOB filing — combination', project: 'Whitman Residence', room: 'Wine Room', assignee: 'Elena', due: 'Jun 30', priority: 'Medium', status: 'open' },
      { id: 110, title: 'Resolve hood vent conflict with joist', project: 'Whitman Residence', room: 'Kitchen', assignee: 'Rafael', due: 'In 2d (May 27)', priority: 'High', status: 'open' },
      { id: 111, title: 'Confirm tile delivery — Carrara 3"x6"', project: 'Whitman Residence', room: 'Primary Bath', assignee: 'Marcus', due: 'In 3d (May 28)', priority: 'High', status: 'open' },
      { id: 112, title: 'Order east-wing windows (Marvin Ultimate)', project: 'Whitman Residence', room: 'East Wing Addition', assignee: 'Marcus', due: 'In 5d (May 30)', priority: 'High', status: 'open' },
      { id: 113, title: 'Cover crew check through hold period', project: 'Whitman Residence', room: 'Project-level', assignee: 'Rafael', due: 'In 6d (May 31)', priority: 'High', status: 'open' },
      { id: 114, title: 'Schedule Co-op board presentation', project: 'Whitman Residence', room: 'Project-level', assignee: 'Marcus', due: 'Jun 18', priority: 'High', status: 'open' },
      { id: 115, title: 'Bench mockup approval', project: 'Whitman Residence', room: 'Mudroom', assignee: 'Sasha', due: '2d ago (May 23)', priority: 'Medium', status: 'open' },
      { id: 116, title: 'Install landscape irrigation manifolds', project: 'Carrington Estate', room: 'Exterior', assignee: 'Jamal', due: 'In 1d', priority: 'Medium', status: 'open' },
      { id: 117, title: 'Review structural calculations for balcony', project: 'Carrington Estate', room: 'Terrace', assignee: 'Elena', due: 'In 7d', priority: 'High', status: 'open' },
      { id: 118, title: 'Verify custom bronze threshold mockups', project: 'Park Avenue Penthouse', room: 'Foyer', assignee: 'Sasha', due: 'In 12d', priority: 'High', status: 'open' },
      { id: 119, title: 'Drywall touchups and wall prime coat', project: 'Lakeside Manor', room: 'Guest Bed 1', assignee: 'Rafael', due: 'Completed', priority: 'Low', status: 'done' }
    ],

    // Active filters on detailed tasks table
    taskFilters: {
      status: 'open', // open, done, mine, all
      search: '',
      grouping: 'project'
    },
    
    // KPI Values
    kpis: {
      tasksCompleted: 0,
      totalTasks: 24,
      overdueTasks: 6
    }
  };

  // Toast Notification System
  const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-msg">${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    
    // Styles for Toast
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      backgroundColor: '#1E293B',
      color: '#FFFFFF',
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
      zIndex: '1000',
      display: 'flex',
      alignItems: 'center',
      borderLeft: `4px solid ${type === 'success' ? '#10B981' : type === 'warning' ? '#F59E0B' : type === 'danger' ? '#EF4444' : '#2563EB'}`,
      transform: 'translateY(100px)',
      opacity: '0',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    });
    
    // Trigger animation
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 50);
    
    // Remove after 3.5s
    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  // ==========================================
  // DOM Elements Selection
  // ==========================================
  const sidebarButtons = document.querySelectorAll('.nav-item');
  const viewTabs = document.querySelectorAll('.view-tab');
  
  // Project selector elements
  const dropdownBtn = document.querySelector('.project-dropdown-btn');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  const projectNameDisplay = document.getElementById('selected-project-name');
  
  // Search elements
  const globalSearchInput = document.getElementById('global-search');
  const searchSuggestionsPopup = document.getElementById('search-suggestions');
  const searchClearBtn = document.getElementById('search-clear');
  const askAiButton = document.getElementById('ask-ai-button');
  
  // Document tree elements
  const treeToggles = document.querySelectorAll('.tree-toggle');
  const leafNodes = document.querySelectorAll('.tree-node.leaf');
  const documentTreeLinks = document.querySelectorAll('.tree-item-link');
  
  // Blueprint canvas elements
  const blueprintViewport = document.getElementById('blueprint-viewport');
  const blueprintZoomContent = document.getElementById('blueprint-zoom-content');
  const zoomPercentDisplay = document.getElementById('zoom-percent-display');
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const btnZoomOut = document.getElementById('btn-zoom-out');
  const btnFitScreen = document.getElementById('btn-fit-screen');
  const btnPanMode = document.getElementById('btn-pan');
  const btnCursorMode = document.getElementById('btn-cursor');
  const markupToolBtns = document.querySelectorAll('.markup-tool-btn');
  const minimapViewfinder = document.getElementById('minimap-viewfinder');
  const blueprintTieBeam = document.getElementById('blueprint-tie-beam');
  const tieBeamMarker = document.getElementById('tie-beam-marker');
  const drawingTitleText = document.getElementById('active-drawing-name');
  
  // AI Panel Related
  const relatedTabLinks = document.querySelectorAll('#related-tabs-headers .tab-link');
  const relatedTabBodies = document.querySelectorAll('#related-tabs-bodies .tab-body');
  
  // Task Checklist container
  const checklistContainer = document.getElementById('checklist-container');

  // Detailed Tasks Table Container
  const detailedTasksTbody = document.getElementById('detailed-tasks-tbody');
  const taskSearchInput = document.getElementById('task-table-search');
  const taskFilterBtns = document.querySelectorAll('.task-filter-btn');
  const taskGroupingSelect = document.getElementById('tasks-grouping');
  const tasksOpenCountText = document.getElementById('tasks-open-count');

  // ==========================================
  // Tab Navigation Handling
  // ==========================================
  const validTabs = [
    'dashboard', 'projects', 'schedule', 'tasks', 'documents', 
    'gs3-portfolio', 'gs3-sop', 'gs3-mobile'
  ];

  const switchTab = (tabId, updateHash = true) => {
    const btn = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    const isLocked = btn && btn.classList.contains('locked-nav');

    // Fallback to dashboard if invalid or locked tab
    if (!validTabs.includes(tabId) || isLocked) {
      tabId = 'dashboard';
    }
    
    state.activeTab = tabId;
    
    // Update sidebar buttons
    sidebarButtons.forEach(b => {
      const btnTab = b.getAttribute('data-tab');
      if (btnTab === tabId) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    // Update main view panels
    let foundTab = false;
    viewTabs.forEach(tab => {
      const contentId = tab.getAttribute('id');
      if (contentId === `tab-content-${tabId}`) {
        tab.classList.add('active');
        foundTab = true;
        // Reset scroll position for mobile simulator scroll container
        if (tabId === 'gs3-mobile') {
          const mobScroll = tab.querySelector('.mobile-scroll-container');
          if (mobScroll) {
            mobScroll.scrollTop = 0;
          }
        }
      } else {
        tab.classList.remove('active');
      }
    });

    // Handle render triggers for dynamic pages
    if (tabId === 'tasks') {
      renderDetailedTasks();
    }

    // If tab doesn't have custom layout, show a gorgeous placeholder
    if (!foundTab) {
      document.getElementById('tab-content-dashboard').classList.add('active');
      document.getElementById('nav-dashboard').classList.add('active');
      showToast(`The ${tabId.charAt(0).toUpperCase() + tabId.slice(1)} view is under active development. Showing Live Dashboard view instead.`, 'warning');
    }

    // Update the browser URL hash if requested
    if (updateHash) {
      window.location.hash = tabId;
    }
  };

  sidebarButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.classList.contains('locked-nav')) {
        e.preventDefault();
        e.stopPropagation();
        const tabId = btn.getAttribute('data-tab');
        const phaseName = btn.querySelector('.nav-badge-locked')?.textContent || 'a later Phase';
        showToast(`The ${tabId.charAt(0).toUpperCase() + tabId.slice(1)} module is slated for development in ${phaseName}.`, 'warning');
        return;
      }
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });



  // ==========================================
  // Project Dropdown
  // ==========================================
  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
  });

  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      dropdownItems.forEach(di => di.classList.remove('active'));
      item.classList.add('active');
      
      const newProjectName = item.textContent;
      state.selectedProject = newProjectName;
      projectNameDisplay.textContent = newProjectName;
      
      dropdownMenu.classList.remove('show');
      showToast(`Switched active workspace to: ${newProjectName}`, 'success');
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    dropdownMenu.classList.remove('show');
  });

  // ==========================================
  // AI Suggestions & Global Search simulation
  // ==========================================
  const searchQueries = [
    { text: 'Where is the tie beam?', category: 'AI Answer Query' },
    { text: 'Roof framing details', category: 'Drawing Detail' },
    { text: 'GS3 Portfolio & Capability', category: 'Proposal Presentation' },
    { text: 'Roadmap timeline & cost calculator', category: 'Proposal Pricing' },
    { text: 'Client testimonials & letters', category: 'Proposal Pitch' }
  ];

  const renderSearchSuggestions = (filterText = '') => {
    searchSuggestionsPopup.innerHTML = '';
    const filtered = searchQueries.filter(q => 
      q.text.toLowerCase().includes(filterText.toLowerCase())
    );
    
    if (filtered.length === 0) {
      searchSuggestionsPopup.classList.remove('show');
      return;
    }

    filtered.forEach(q => {
      const div = document.createElement('div');
      div.className = 'search-suggestion-item';
      div.innerHTML = `
        <svg class="search-suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
        </svg>
        <span class="search-suggestion-query">${q.text}</span>
        <span class="search-suggestion-category">${q.category}</span>
      `;
      div.addEventListener('click', () => {
        globalSearchInput.value = q.text;
        triggerGlobalSearch(q.text);
      });
      searchSuggestionsPopup.appendChild(div);
    });

    searchSuggestionsPopup.classList.add('show');
  };

  globalSearchInput.addEventListener('input', (e) => {
    const val = e.target.value;
    if (val.length > 0) {
      searchClearBtn.style.display = 'block';
    } else {
      searchClearBtn.style.display = 'none';
    }
    renderSearchSuggestions(val);
  });

  globalSearchInput.addEventListener('focus', () => {
    renderSearchSuggestions(globalSearchInput.value);
  });

  // Hide search suggestions on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      searchSuggestionsPopup.classList.remove('show');
    }
  });

  searchClearBtn.addEventListener('click', () => {
    globalSearchInput.value = '';
    searchClearBtn.style.display = 'none';
    searchSuggestionsPopup.classList.remove('show');
  });

  const triggerGlobalSearch = (query) => {
    state.searchQuery = query;
    searchSuggestionsPopup.classList.remove('show');
    
    // Check for Pitch Hub queries
    if (query.toLowerCase().includes('sop') || query.toLowerCase().includes('domain') || query.toLowerCase().includes('pain') || query.toLowerCase().includes('problems') || query.toLowerCase().includes('sprints plan') || query.toLowerCase().includes('standard operating')) {
      switchTab('gs3-sop');
      showToast('Opening K2 Technical Roadmap & SOP Playbook.', 'success');
      return;
    }
    if (query.toLowerCase().includes('portfolio')) {
      switchTab('gs3-portfolio');
      showToast('Loading GS3 Construction Tech Portfolio for Stacey Schrager.', 'success');
      return;
    }
    if (query.toLowerCase().includes('pricing') || query.toLowerCase().includes('calculator') || query.toLowerCase().includes('roadmap') || query.toLowerCase().includes('proposal')) {
      switchTab('gs3-sop');
      showToast('Opening K2 Custom proposal & technology roadmap.', 'success');
      return;
    }
    if (query.toLowerCase().includes('testimonial') || query.toLowerCase().includes('letter') || query.toLowerCase().includes('review')) {
      switchTab('gs3-portfolio');
      showToast('Opening GS3 customer success testimonials.', 'success');
      return;
    }
    
    // Switch to documents tab
    switchTab('documents');
    
    // Update local query text
    const displayQueryText = document.getElementById('query-display-text');
    if (displayQueryText) {
      displayQueryText.textContent = query;
    }
    
    // Simulating specific result matches
    if (query.toLowerCase().includes('beam') || query.toLowerCase().includes('tie')) {
      loadDrawing('structural');
      zoomToCoordinates(680, 410, 1.4);
      showToast('AI found 1 matching element: Tie Beam (TB-1) on Level 2 structural plan.', 'success');
      
      if (blueprintTieBeam) {
        blueprintTieBeam.classList.add('highlight-pulse');
      }
    } else {
      showToast(`AI query search complete for "${query}". No direct elements mapped. Showing overall sheets.`, 'info');
    }
  };

  globalSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && globalSearchInput.value.trim() !== '') {
      triggerGlobalSearch(globalSearchInput.value.trim());
    }
  });

  // Recent Searches clicks
  document.querySelectorAll('.search-history-item').forEach(item => {
    item.addEventListener('click', () => {
      const q = item.getAttribute('data-query');
      globalSearchInput.value = q;
      triggerGlobalSearch(q);
    });
  });

  // ==========================================
  // Document Library Folder Tree
  // ==========================================
  treeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const parent = toggle.closest('.tree-node');
      parent.classList.toggle('expanded');
      parent.classList.toggle('collapsed');
    });
  });

  const loadDrawing = (dwgType) => {
    state.activeDrawing = dwgType;
    
    leafNodes.forEach(node => {
      if (node.getAttribute('data-file') === dwgType) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });

    const steelLabels = document.querySelector('#blueprint-svg g[font-size="9"]');
    
    if (dwgType === 'structural') {
      drawingTitleText.textContent = 'Structural Plan - Level 2 (S-201)';
      if (blueprintTieBeam) blueprintTieBeam.style.display = 'block';
      if (tieBeamMarker) tieBeamMarker.style.display = 'block';
      if (steelLabels) steelLabels.style.display = 'block';
      document.querySelector('#blueprint-svg rect').setAttribute('fill', '#fcfdfd');
    } 
    else if (dwgType === 'architectural') {
      drawingTitleText.textContent = 'Architectural Layout - Ground Level (A-101)';
      if (blueprintTieBeam) blueprintTieBeam.style.display = 'none';
      if (tieBeamMarker) tieBeamMarker.style.display = 'none';
      if (steelLabels) steelLabels.style.display = 'none';
      document.querySelector('#blueprint-svg rect').setAttribute('fill', '#ffffff');
      showToast('Loaded Architectural Ground Floor plan.', 'info');
    } 
    else if (dwgType === 'mep') {
      drawingTitleText.textContent = 'Mechanical Electrical Plumbing Layout (M-201)';
      if (blueprintTieBeam) blueprintTieBeam.style.display = 'none';
      if (tieBeamMarker) tieBeamMarker.style.display = 'none';
      if (steelLabels) steelLabels.style.display = 'none';
      document.querySelector('#blueprint-svg rect').setAttribute('fill', '#f4fbfd');
      showToast('Loaded MEP layout plan.', 'info');
    } 
    else if (dwgType === 'civil') {
      drawingTitleText.textContent = 'Civil Grading & Landscape Plan (C-101)';
      if (blueprintTieBeam) blueprintTieBeam.style.display = 'none';
      if (tieBeamMarker) tieBeamMarker.style.display = 'none';
      if (steelLabels) steelLabels.style.display = 'none';
      document.querySelector('#blueprint-svg rect').setAttribute('fill', '#fcfdfa');
      showToast('Loaded Civil Site grading plan.', 'info');
    }

    resetCanvas();
  };

  leafNodes.forEach(leaf => {
    leaf.addEventListener('click', () => {
      const file = leaf.getAttribute('data-file');
      loadDrawing(file);
    });
  });

  documentTreeLinks.forEach(link => {
    link.addEventListener('click', () => {
      const linkLabel = link.querySelector('.node-label').textContent;
      showToast(`Loading index list matching: ${linkLabel}`, 'info');
    });
  });

  // ==========================================
  // Interactive Blueprint Canvas Zoom & Pan
  // ==========================================
  
  const updateCanvasTransform = () => {
    const { scale, translateX, translateY } = state.canvas;
    blueprintZoomContent.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    zoomPercentDisplay.textContent = `${Math.round(scale * 100)}%`;
    
    const width = Math.max(100, Math.min(1000, 1000 / scale));
    const height = Math.max(84, Math.min(700, 700 / scale));
    
    const x = Math.max(0, Math.min(1000 - width, -translateX / scale));
    const y = Math.max(0, Math.min(700 - height, -translateY / scale));
    
    if (minimapViewfinder) {
      minimapViewfinder.setAttribute('x', x);
      minimapViewfinder.setAttribute('y', y);
      minimapViewfinder.setAttribute('width', width);
      minimapViewfinder.setAttribute('height', height);
    }
  };

  const resetCanvas = () => {
    state.canvas.scale = 1.0;
    state.canvas.translateX = 0;
    state.canvas.translateY = 0;
    updateCanvasTransform();
  };

  const zoomToCoordinates = (targetX, targetY, targetScale) => {
    state.canvas.scale = targetScale;
    const viewportWidth = blueprintViewport.clientWidth;
    const viewportHeight = blueprintViewport.clientHeight;
    
    state.canvas.translateX = (viewportWidth / 2) - (targetX * targetScale);
    state.canvas.translateY = (viewportHeight / 2) - (targetY * targetScale);
    updateCanvasTransform();
  };

  // Mouse Dragging for Pan Mode
  blueprintViewport.addEventListener('mousedown', (e) => {
    if (state.canvas.mode !== 'pan') return;
    state.canvas.isDragging = true;
    state.canvas.startX = e.clientX - state.canvas.translateX;
    state.canvas.startY = e.clientY - state.canvas.translateY;
    blueprintViewport.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!state.canvas.isDragging) return;
    state.canvas.translateX = e.clientX - state.canvas.startX;
    state.canvas.translateY = e.clientY - state.canvas.startY;
    
    const maxPanX = 500;
    const maxPanY = 400;
    state.canvas.translateX = Math.max(-1000, Math.min(maxPanX, state.canvas.translateX));
    state.canvas.translateY = Math.max(-700, Math.min(maxPanY, state.canvas.translateY));
    
    updateCanvasTransform();
  });

  window.addEventListener('mouseup', () => {
    if (state.canvas.isDragging) {
      state.canvas.isDragging = false;
      blueprintViewport.style.cursor = 'grab';
    }
  });

  // Wheel Zoom support
  blueprintViewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = 0.08;
    const oldScale = state.canvas.scale;
    
    let newScale = oldScale - e.deltaY * zoomFactor * 0.01;
    newScale = Math.max(0.5, Math.min(4.0, newScale));
    
    const rect = blueprintViewport.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const svgMouseX = (mouseX - state.canvas.translateX) / oldScale;
    const svgMouseY = (mouseY - state.canvas.translateY) / oldScale;
    
    state.canvas.scale = newScale;
    state.canvas.translateX = mouseX - svgMouseX * newScale;
    state.canvas.translateY = mouseY - svgMouseY * newScale;
    
    updateCanvasTransform();
  });

  // Zoom Button event listeners
  btnZoomIn.addEventListener('click', () => {
    state.canvas.scale = Math.min(4.0, state.canvas.scale + 0.2);
    updateCanvasTransform();
  });

  btnZoomOut.addEventListener('click', () => {
    state.canvas.scale = Math.max(0.5, state.canvas.scale - 0.2);
    updateCanvasTransform();
  });

  btnFitScreen.addEventListener('click', () => {
    resetCanvas();
    showToast('Zoom fit to viewport reset.', 'info');
  });

  // Mode Selection: Pan or Select Cursor
  btnPanMode.addEventListener('click', () => {
    state.canvas.mode = 'pan';
    btnPanMode.classList.add('active');
    btnCursorMode.classList.remove('active');
    blueprintViewport.style.cursor = 'grab';
  });

  btnCursorMode.addEventListener('click', () => {
    state.canvas.mode = 'select';
    btnPanMode.classList.remove('active');
    btnCursorMode.classList.add('active');
    blueprintViewport.style.cursor = 'default';
  });

  // Floating markup toolbar button interactions
  markupToolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      markupToolBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tool = btn.getAttribute('data-tool');
      state.canvas.activeTool = tool;
      showToast(`Active Markup Tool: ${tool.toUpperCase()}. Click canvas to place.`, 'info');
    });
  });

  // Add Dynamic Markup elements to SVG on click
  const svgCanvasEl = document.getElementById('blueprint-svg');
  svgCanvasEl.addEventListener('click', (e) => {
    if (state.canvas.mode !== 'select') return;
    
    const tool = state.canvas.activeTool;
    if (tool === 'select') return;
    
    const rect = svgCanvasEl.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const svgX = (clickX - state.canvas.translateX) / state.canvas.scale * (1000 / rect.width);
    const svgY = (clickY - state.canvas.translateY) / state.canvas.scale * (700 / rect.height);
    
    if (tool === 'comment') {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${svgX}, ${svgY})`);
      g.innerHTML = `
        <circle cx="0" cy="0" r="12" fill="#EAB308" stroke="white" stroke-width="2" class="cursor-pointer"/>
        <text x="0" y="3" fill="white" font-size="10" font-family="Outfit" font-weight="800" text-anchor="middle">!</text>
      `;
      svgCanvasEl.appendChild(g);
      showToast('Comment Pin placed on blueprint. Syncing with database.', 'success');
    }
    else if (tool === 'cloud') {
      const cloud = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      cloud.setAttribute('d', `M ${svgX-20} ${svgY} a 10,10 0 0,1 10,-10 a 12,12 0 0,1 20,0 a 10,10 0 0,1 10,10 a 10,10 0 0,1 -10,10 a 10,10 0 0,1 -20,0 a 10,10 0 0,1 -10,-10 Z`);
      cloud.setAttribute('fill', 'none');
      cloud.setAttribute('stroke', '#EF4444');
      cloud.setAttribute('stroke-width', '2');
      svgCanvasEl.appendChild(cloud);
      showToast('Revision Cloud added to plan layout.', 'success');
    }
    else if (tool === 'measure') {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', `${svgX - 30}`);
      line.setAttribute('y1', `${svgY}`);
      line.setAttribute('x2', `${svgX + 30}`);
      line.setAttribute('y2', `${svgY}`);
      line.setAttribute('stroke', '#06B6D4');
      line.setAttribute('stroke-width', '2');
      line.setAttribute('stroke-dasharray', '3 3');
      
      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('x', `${svgX}`);
      txt.setAttribute('y', `${svgY - 6}`);
      txt.setAttribute('fill', '#06B6D4');
      txt.setAttribute('font-size', '9');
      txt.setAttribute('font-family', 'monospace');
      txt.setAttribute('text-anchor', 'middle');
      txt.textContent = '6\'-0" (est)';
      
      svgCanvasEl.appendChild(line);
      svgCanvasEl.appendChild(txt);
      showToast('Simulated measurement placed.', 'info');
    }
  });

  // Clicking on tie beam element in blueprint activates details
  const activateTieBeamDetails = () => {
    switchTab('documents');
    zoomToCoordinates(710, 450, 1.3);
    
    leafNodes.forEach(ln => {
      if (ln.getAttribute('data-file') === 'structural') ln.classList.add('active');
      else ln.classList.remove('active');
    });

    showToast('AI details triggered for Tie Beam (TB-1).', 'success');
  };

  if (blueprintTieBeam) blueprintTieBeam.addEventListener('click', activateTieBeamDetails);
  if (tieBeamMarker) tieBeamMarker.addEventListener('click', activateTieBeamDetails);

  // ==========================================
  // RFI Details popup / trigger search
  // ==========================================
  document.querySelectorAll('.rfi-item').forEach(item => {
    item.addEventListener('click', () => {
      const rfiId = item.getAttribute('data-rfi');
      const title = item.querySelector('.rfi-title').textContent;
      
      if (rfiId === 'RFI-1023') {
        globalSearchInput.value = 'Where is the tie beam?';
        triggerGlobalSearch('Where is the tie beam?');
      } else {
        showToast(`Detail modal for ${rfiId}: "${title}" opening soon.`, 'info');
      }
    });
  });

  // ==========================================
  // AI Answer Panel Related Tab Switcher
  // ==========================================
  relatedTabLinks.forEach(link => {
    link.addEventListener('click', () => {
      relatedTabLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      const relId = link.getAttribute('data-rel');
      
      relatedTabBodies.forEach(body => {
        const bodyId = body.getAttribute('id');
        if (bodyId === `rel-body-${relId}`) {
          body.classList.add('active');
        } else {
          body.classList.remove('active');
        }
      });
    });
  });

  // Load Drawing from related drawings links
  document.querySelectorAll('.drawing-link-card').forEach(card => {
    card.addEventListener('click', () => {
      const dwg = card.getAttribute('data-load-dwg');
      if (dwg === 's101') {
        loadDrawing('civil'); // grading
      } else if (dwg === 's301') {
        loadDrawing('architectural');
      }
    });
  });

  // Action Buttons Toast handlers
  document.querySelectorAll('.quick-actions-grid button, .drawing-actions button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const txt = btn.textContent.trim() || btn.getAttribute('title') || 'Action';
      showToast(`Triggered: ${txt}`, 'info');
    });
  });

  // ==========================================
  // Interactive Checklist Tasks (Dashboard Mini Widget)
  // ==========================================
  const renderTasks = () => {
    if (!checklistContainer) return;
    checklistContainer.innerHTML = '';
    state.tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'checklist-item';
      li.setAttribute('data-id', task.id);
      li.innerHTML = `
        <label class="checkbox-wrapper">
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
          <span class="custom-checkbox"></span>
          <span class="checklist-text">${task.text}</span>
        </label>
        <div class="checklist-meta">
          <span class="meta-time">${task.time}</span>
          <span class="priority-badge priority-${task.priority.toLowerCase()}">${task.priority}</span>
        </div>
      `;

      const checkbox = li.querySelector('.task-checkbox');
      checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        state.kpis.tasksCompleted = state.tasks.filter(t => t.completed).length;
        
        const kpiTodayTasks = document.querySelector('.kpi-card:nth-child(4) .kpi-card-value');
        if (kpiTodayTasks) {
          const remaining = state.kpis.totalTasks - state.kpis.tasksCompleted;
          kpiTodayTasks.textContent = `${remaining}`;
        }

        if (task.completed) {
          showToast(`Task Completed: ${task.text}`, 'success');
        } else {
          showToast(`Task Uncompleted: ${task.text}`, 'warning');
        }
        
        const textSpan = li.querySelector('.checklist-text');
        if (task.completed) {
          textSpan.style.textDecoration = 'line-through';
          textSpan.style.color = 'var(--text-light)';
        } else {
          textSpan.style.textDecoration = 'none';
          textSpan.style.color = 'var(--text-main)';
        }
      });

      checklistContainer.appendChild(li);
    });
  };

  renderTasks();
  
  // Ask AI Button inside query header bar click simulator
  if (askAiButton) {
    askAiButton.addEventListener('click', () => {
      showToast('Connecting with AI model... Generating details for current layout.', 'info');
      setTimeout(() => {
        activateTieBeamDetails();
      }, 500);
    });
  }

  // Handle minimap click to pan to that sector
  const minimapPreview = document.querySelector('.blueprint-minimap-preview');
  if (minimapPreview) {
    minimapPreview.addEventListener('click', (e) => {
      const rect = minimapPreview.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      const targetX = clickX / rect.width * 1000;
      const targetY = clickY / rect.height * 700;
      
      zoomToCoordinates(targetX, targetY, state.canvas.scale);
      showToast(`Panned blueprint layout viewer to (${Math.round(targetX)}, ${Math.round(targetY)})`, 'info');
    });
  }

  // ==========================================
  // Detailed Tasks Table Rendering & Search
  // ==========================================
  const renderDetailedTasks = () => {
    if (!detailedTasksTbody) return;
    
    detailedTasksTbody.innerHTML = '';
    const filter = state.taskFilters;
    
    // Apply filters
    let filtered = state.detailedTasks.filter(task => {
      // 1. Status Filter
      if (filter.status === 'open' && task.status !== 'open') return false;
      if (filter.status === 'done' && task.status !== 'done') return false;
      if (filter.status === 'mine' && task.assignee !== 'Sasha') return false; // "Mine" simulates Sasha/Maor
      
      // 2. Search Text Filter
      if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase()) && !task.room.toLowerCase().includes(filter.search.toLowerCase())) {
        return false;
      }
      
      return true;
    });

    // Sort or group (Simulated basic project sorting for Whitman Residence first)
    if (filter.grouping === 'project') {
      filtered.sort((a, b) => a.project.localeCompare(b.project));
    } else if (filter.grouping === 'room') {
      filtered.sort((a, b) => a.room.localeCompare(b.room));
    } else if (filter.grouping === 'status') {
      filtered.sort((a, b) => a.status.localeCompare(b.status));
    }

    // Set count text
    const openCount = state.detailedTasks.filter(t => t.status === 'open').length;
    if (tasksOpenCountText) {
      tasksOpenCountText.textContent = `${openCount} open tasks across active portfolios`;
    }

    if (filtered.length === 0) {
      detailedTasksTbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 24px; color: var(--text-muted);">
            No tasks match the active filters.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(task => {
      const tr = document.createElement('tr');
      
      // Build assignee initial badge
      const initials = task.assignee.substring(0, 2).toUpperCase();
      let avatarClass = 'bg-blue-avatar';
      if (task.assignee === 'Sasha' || task.assignee === 'Elena') avatarClass = 'bg-purple-avatar';
      if (task.assignee === 'Marcus' || task.assignee === 'Rafael') avatarClass = 'bg-green-avatar';
      
      tr.innerHTML = `
        <td><input type="checkbox" class="task-row-checkbox" data-id="${task.id}" ${task.status === 'done' ? 'checked' : ''}></td>
        <td class="task-title-cell ${task.status === 'done' ? 'completed' : ''}">${task.title}</td>
        <td class="font-medium">${task.project}</td>
        <td><span class="room-tag">${task.room}</span></td>
        <td>
          <div class="assignee-avatar-cell">
            <span class="assignee-circle ${avatarClass}">${initials}</span>
            <span class="mini-avatar-name">${task.assignee}</span>
          </div>
        </td>
        <td class="font-semibold text-muted">${task.due}</td>
        <td>
          <span class="priority-badge priority-${task.priority.toLowerCase()}">${task.priority}</span>
        </td>
        <td>
          <span class="status-pill ${task.status === 'done' ? 'status-answered' : 'status-open'}">
            ${task.status === 'done' ? 'Completed' : 'Open'}
          </span>
        </td>
      `;

      // Event listener for row checkbox toggle
      const chk = tr.querySelector('.task-row-checkbox');
      chk.addEventListener('change', () => {
        const t = state.detailedTasks.find(item => item.id === task.id);
        if (t) {
          t.status = chk.checked ? 'done' : 'open';
          showToast(chk.checked ? `Checked off: ${t.title}` : `Reopened: ${t.title}`, chk.checked ? 'success' : 'warning');
          renderDetailedTasks();
        }
      });

      detailedTasksTbody.appendChild(tr);
    });
  };

  // Detailed Tasks filter event listeners
  taskFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      taskFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.taskFilters.status = btn.getAttribute('data-status');
      renderDetailedTasks();
    });
  });

  if (taskSearchInput) {
    taskSearchInput.addEventListener('input', (e) => {
      state.taskFilters.search = e.target.value;
      renderDetailedTasks();
    });
  }

  if (taskGroupingSelect) {
    taskGroupingSelect.addEventListener('change', (e) => {
      state.taskFilters.grouping = e.target.value;
      renderDetailedTasks();
    });
  }

  // select all detailed tasks mock
  const selectAllTasksCheckbox = document.getElementById('select-all-tasks');
  if (selectAllTasksCheckbox) {
    selectAllTasksCheckbox.addEventListener('change', () => {
      const isChecked = selectAllTasksCheckbox.checked;
      state.detailedTasks.forEach(t => {
        if (state.taskFilters.status === 'all' || t.status === state.taskFilters.status) {
          t.status = isChecked ? 'done' : 'open';
        }
      });
      showToast(isChecked ? 'Marked all filtered tasks completed.' : 'Marked all filtered tasks open.', 'info');
      renderDetailedTasks();
    });
  }

  // ==========================================
  // GS3 Proposal Investment Calculator
  // ==========================================
  const calcCheckcards = document.querySelectorAll('.calc-checkbox-card');
  const calcTierCards = document.querySelectorAll('.calc-tier-card');
  const calcTierRadios = document.querySelectorAll('.calc-tier-radio');
  
  const calcTotalCostDisplay = document.getElementById('calc-total-cost');
  const calcTimelineDisplay = document.getElementById('calc-timeline');
  const calcSprintsDisplay = document.getElementById('calc-sprints');
  const calcRoiDisplay = document.getElementById('calc-roi');

  const updateProposalEstimates = () => {
    if (!calcTotalCostDisplay) return;

    // 1. Determine selected tier rate
    let rate = 3500; // Fixed negotiable rate under 80k budget
    let tierName = 'better';
    calcTierRadios.forEach(radio => {
      if (radio.checked) {
        tierName = radio.value;
      }
    });

    // 2. Loop through checkbox cards, update item prices, and sum totals
    let totalCost = 0;
    let totalSprints = 0;
    let activePhasesCount = 0;

    // Count active phases first to calculate planning cost dynamically
    calcCheckcards.forEach(card => {
      const type = card.getAttribute('data-type');
      const chk = card.querySelector('.calc-chk');
      if (type === 'phase' && chk && chk.checked) {
        activePhasesCount++;
      }
    });

    calcCheckcards.forEach(card => {
      const type = card.getAttribute('data-type');
      const chk = card.querySelector('.calc-chk');
      const priceDisplay = card.querySelector('.calc-item-price');

      let sprints = parseInt(card.getAttribute('data-sprints') || '0', 10);
      let cost = parseInt(card.getAttribute('data-cost') || '0', 10);

      // Adjust planning baseline cost based on active phases
      if (type === 'fixed') {
        cost = activePhasesCount * 4 * 1199;
        card.setAttribute('data-cost', cost);
        const titleSpan = card.querySelector('.calc-chk-title');
        const descSpan = card.querySelector('.calc-chk-desc');
        if (titleSpan) {
          titleSpan.textContent = `Mandatory Planning Baseline (${activePhasesCount * 4} Modules)`;
        }
        if (descSpan) {
          descSpan.textContent = `Paid discovery workshops to detail workflows before coding ($1,199 / module for ${activePhasesCount * 4} modules).`;
        }
      }

      // Compute individual item cost dynamically for sprints
      let itemCost = cost;
      if (type === 'phase' || type === 'addon') {
        itemCost = sprints * rate;
      }

      // Update card's price display text
      if (priceDisplay) {
        priceDisplay.textContent = `$${itemCost.toLocaleString()}`;
      }

      // Sum if checked
      if (chk && chk.checked) {
        totalCost += itemCost;
        if (type === 'phase' || type === 'addon') {
          totalSprints += sprints;
        }
      }
    });

    // 3. Render outputs
    calcTotalCostDisplay.textContent = `$${totalCost.toLocaleString()}`;
    calcSprintsDisplay.textContent = `${totalSprints} Sprint${totalSprints !== 1 ? 's' : ''}`;
    
    const weeks = totalSprints * 2;
    calcTimelineDisplay.textContent = `${weeks} Week${weeks !== 1 ? 's' : ''}`;

    // Update ROI label
    if (tierName === 'best') {
      calcRoiDisplay.textContent = 'Elite OS Enterprise';
      calcRoiDisplay.style.color = '#8B5CF6'; // purple
    } else if (tierName === 'better') {
      calcRoiDisplay.textContent = 'Recommended Pitch';
      calcRoiDisplay.style.color = '#10B981'; // green
    } else {
      calcRoiDisplay.textContent = 'Conservative Core';
      calcRoiDisplay.style.color = '#3B82F6'; // blue
    }
  };

  // Bind clicks for tier radio cards
  calcTierCards.forEach(tCard => {
    tCard.addEventListener('click', () => {
      const radio = tCard.querySelector('.calc-tier-radio');
      if (radio) {
        radio.checked = true;
        
        // Toggle active classes
        calcTierCards.forEach(c => c.classList.remove('active'));
        tCard.classList.add('active');
        
        updateProposalEstimates();
      }
    });
  });

  // Bind checkbox cards
  calcCheckcards.forEach(card => {
    const chk = card.querySelector('.calc-chk');
    if (!chk) return;

    // Whenever checkbox changes, update active status and recalculate
    chk.addEventListener('change', () => {
      if (chk.checked) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
      updateProposalEstimates();
    });

    // Outer card click triggers checkbox toggle safely
    card.addEventListener('click', (e) => {
      if (chk.disabled) return;
      if (e.target !== chk && !e.target.closest('label') && !e.target.closest('.calc-chk')) {
        chk.checked = !chk.checked;
        // Trigger the change event manually since checking programmatic checked doesn't dispatch it
        chk.dispatchEvent(new Event('change'));
      }
    });
  });

  // Trigger Action Buttons in Pitch Hub
  const btnRequestPack = document.getElementById('btn-request-proposal-pack');
  const btnScheduleStacey = document.getElementById('btn-schedule-stacey');

  if (btnRequestPack) {
    btnRequestPack.addEventListener('click', () => {
      showToast('Preparing PDF Proposal Pack custom configured for K2 Construction. Sent to staceyschrager@gmail.com.', 'success');
    });
  }

  if (btnScheduleStacey) {
    btnScheduleStacey.addEventListener('click', () => {
      showToast('Opening Scheduler Calendar widget. Inviting Stacey Schrager (+1 954-636-2238) for Zoom sync.', 'success');
    });
  }

  // Add listener for Task Addition button
  const btnAddTask = document.getElementById('btn-add-task-modal');
  if (btnAddTask) {
    btnAddTask.addEventListener('click', () => {
      const taskTitle = prompt('Enter new task description:');
      if (taskTitle && taskTitle.trim() !== '') {
        const newTask = {
          id: Date.now(),
          title: taskTitle.trim(),
          project: 'Whitman Residence',
          room: 'General',
          assignee: 'Sasha',
          due: 'In 3d',
          priority: 'Medium',
          status: 'open'
        };
        state.detailedTasks.unshift(newTask);
        showToast(`Task Created: ${newTask.title}`, 'success');
        renderDetailedTasks();
      }
    });
  }

  // GS3 Proposal Hub Sub-tabs switcher
  const pitchSubtabLinks = document.querySelectorAll('.pitch-subtab-link');
  const pitchSubtabBodies = document.querySelectorAll('.pitch-subtab-body');

  pitchSubtabLinks.forEach(link => {
    link.addEventListener('click', () => {
      pitchSubtabLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const targetSubtab = link.getAttribute('data-subtab');

      pitchSubtabBodies.forEach(body => {
        const bodyId = body.getAttribute('id');
        if (bodyId === `pitch-body-${targetSubtab}`) {
          body.style.display = 'block';
        } else {
          body.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // K2 Mobile App Simulator Logic
  // ==========================================
  
  const mobTaskCheckboxes = document.querySelectorAll('.mob-task-checkbox');
  const mobProgressFill = document.getElementById('mobile-progress-fill');
  const mobProgressPercentage = document.getElementById('mobile-progress-percentage');
  const mobProgressTaskCount = document.getElementById('mobile-progress-task-count');
  
  const simProgressRange = document.getElementById('sim-progress-range');
  const simProgressDisplay = document.getElementById('sim-progress-display');
  
  const btnThemeDark = document.getElementById('btn-theme-dark');
  const btnThemeLight = document.getElementById('btn-theme-light');
  const phoneViewport = document.querySelector('.phone-screen-viewport');
  
  const mobActionVoice = document.getElementById('mob-action-voice');
  const mobActionDrawing = document.getElementById('mob-action-drawing');
  const mobTabDrawingsTrigger = document.getElementById('mob-tab-drawings-trigger');
  const mobTabTasksTrigger = document.getElementById('mob-tab-tasks-trigger');

  // 1. Recalculate progress based on checked tasks
  const updateMobileProgressGauge = (percent) => {
    const rounded = Math.round(percent);
    if (mobProgressPercentage) mobProgressPercentage.textContent = `${rounded}%`;
    if (simProgressDisplay) simProgressDisplay.textContent = `${rounded}%`;
    if (simProgressRange) simProgressRange.value = rounded;
    if (mobProgressFill) {
      mobProgressFill.setAttribute('stroke-dasharray', `${rounded}, 100`);
    }
  };

  const calculateCheckboxProgress = () => {
    let totalWeight = 0;
    let completedWeight = 0;
    
    mobTaskCheckboxes.forEach(cb => {
      const weight = parseInt(cb.getAttribute('data-task-weight') || '10');
      totalWeight += weight;
      if (cb.checked) {
        completedWeight += weight;
      }
    });

    const percent = totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0;
    updateMobileProgressGauge(percent);

    const scaledCompleted = Math.round((percent / 100) * 74);
    if (mobProgressTaskCount) {
      mobProgressTaskCount.textContent = `${scaledCompleted} of 74 tasks`;
    }
  };

  // Bind checkbox events
  mobTaskCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const card = cb.closest('.mob-task-card');
      const ringCircle = card.querySelector('.mob-ring-svg circle:nth-child(2)');
      const ringText = card.querySelector('.mob-ring-percent');
      
      if (cb.checked) {
        if (ringCircle) ringCircle.setAttribute('stroke-dasharray', '100, 100');
        if (ringCircle) ringCircle.setAttribute('stroke', '#10B981');
        if (ringText) ringText.textContent = '100%';
      } else {
        const originalPercent = cb.getAttribute('data-task-weight') === '15' ? '70%' :
                               cb.getAttribute('data-task-weight') === '10' ? '40%' : '0%';
        const originalDash = cb.getAttribute('data-task-weight') === '15' ? '70, 100' :
                             cb.getAttribute('data-task-weight') === '10' ? '40, 100' : '0, 100';
        const originalColor = cb.getAttribute('data-task-weight') === '15' ? '#2563EB' : '#F59E0B';
        
        if (ringCircle) ringCircle.setAttribute('stroke-dasharray', originalDash);
        if (ringCircle) ringCircle.setAttribute('stroke', originalColor);
        if (ringText) ringText.textContent = originalPercent;
      }
      
      calculateCheckboxProgress();
    });
  });

  // 2. Manual Progress Override Slider
  if (simProgressRange) {
    simProgressRange.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      updateMobileProgressGauge(val);
      
      if (val === 0) {
        mobTaskCheckboxes.forEach(cb => {
          cb.checked = false;
          const card = cb.closest('.mob-task-card');
          const ringCircle = card.querySelector('.mob-ring-svg circle:nth-child(2)');
          const ringText = card.querySelector('.mob-ring-percent');
          if (ringCircle) ringCircle.setAttribute('stroke-dasharray', '0, 100');
          if (ringText) ringText.textContent = '0%';
        });
      } else if (val === 100) {
        mobTaskCheckboxes.forEach(cb => {
          cb.checked = true;
          const card = cb.closest('.mob-task-card');
          const ringCircle = card.querySelector('.mob-ring-svg circle:nth-child(2)');
          const ringText = card.querySelector('.mob-ring-percent');
          if (ringCircle) ringCircle.setAttribute('stroke-dasharray', '100, 100');
          if (ringCircle) ringCircle.setAttribute('stroke', '#10B981');
          if (ringText) ringText.textContent = '100%';
        });
      }
      
      const scaledCompleted = Math.round((val / 100) * 74);
      if (mobProgressTaskCount) {
        mobProgressTaskCount.textContent = `${scaledCompleted} of 74 tasks`;
      }
    });
  }

  // 3. Theme Toggle Support
  if (btnThemeDark && btnThemeLight && phoneViewport) {
    btnThemeDark.addEventListener('click', () => {
      phoneViewport.classList.remove('mobile-theme-light');
      phoneViewport.classList.add('mobile-theme-dark');
      btnThemeDark.classList.add('active');
      btnThemeLight.classList.remove('active');
    });

    btnThemeLight.addEventListener('click', () => {
      phoneViewport.classList.remove('mobile-theme-dark');
      phoneViewport.classList.add('mobile-theme-light');
      btnThemeLight.classList.add('active');
      btnThemeDark.classList.remove('active');
    });
  }

  // 4. Voice Dictation RFI Simulation
  if (mobActionVoice && phoneViewport) {
    mobActionVoice.addEventListener('click', () => {
      const modal = document.createElement('div');
      modal.className = 'mob-speech-overlay-modal';
      modal.innerHTML = `
        <div class="mob-speech-content-card">
          <div class="mob-speech-header-row">
            <span class="mob-speech-title font-header">Voice Report Agent</span>
            <button class="mob-speech-close-btn">&times;</button>
          </div>
          
          <div class="mob-speech-status-pill">
            <span class="mob-pulse-dot"></span>
            <span>LISTENING & TRANSCRIBING...</span>
          </div>

          <div class="mob-speech-transcription-box font-medium"></div>

          <div class="mob-speech-wave-visualization">
            <div class="mob-wave-bar"></div>
            <div class="mob-wave-bar"></div>
            <div class="mob-wave-bar"></div>
            <div class="mob-wave-bar"></div>
            <div class="mob-wave-bar"></div>
            <div class="mob-wave-bar"></div>
            <div class="mob-wave-bar"></div>
            <div class="mob-wave-bar"></div>
            <div class="mob-wave-bar"></div>
            <div class="mob-wave-bar"></div>
          </div>
          
          <p style="font-size: 9px; text-align: center; opacity: 0.6; margin: 0;">Dictating site status reports directly to Firestore database...</p>
        </div>
      `;
      phoneViewport.appendChild(modal);

      const transcriptText = "Good morning PM office. This is John Carter reporting on site from the Sunset Residence. I have successfully inspected the level 2 structural reinforcement. The tie beams are fully set and ready for inspection sign-off. Please upload these notes directly to the project files. Over.";
      const textBox = modal.querySelector('.mob-speech-transcription-box');
      const closeBtn = modal.querySelector('.mob-speech-close-btn');

      closeBtn.addEventListener('click', () => {
        modal.remove();
      });

      let charIndex = 0;
      const typeSpeed = 40;
      
      const typeSpeech = () => {
        if (charIndex < transcriptText.length && modal.parentNode) {
          textBox.textContent += transcriptText.charAt(charIndex);
          charIndex++;
          textBox.scrollTop = textBox.scrollHeight;
          setTimeout(typeSpeech, typeSpeed);
        } else if (modal.parentNode) {
          const statusText = modal.querySelector('.mob-speech-status-pill span:last-child');
          const statusDot = modal.querySelector('.mob-pulse-dot');
          const waveBars = modal.querySelectorAll('.mob-wave-bar');
          
          if (statusText) statusText.textContent = 'REPORT COMPILED & SYNCED';
          if (statusDot) statusDot.style.backgroundColor = '#10B981';
          
          waveBars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
            bar.style.height = '4px';
          });
          
          showToast("Mobile RFI speech record sync complete!", "success");
        }
      };

      setTimeout(typeSpeech, 800);
    });
  }

  // 5. Deep Link Redirection to Drawings
  const redirectToDrawingsTab = () => {
    switchTab('documents');
    showToast("Opening K2 blueprint drawings view...", "info");
    
    const structuralNode = document.querySelector('[data-file="structural"]');
    if (structuralNode) {
      structuralNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
      structuralNode.classList.add('highlight-pulse');
      setTimeout(() => {
        structuralNode.classList.remove('highlight-pulse');
      }, 3000);
    }
  };

  if (mobActionDrawing) {
    mobActionDrawing.addEventListener('click', redirectToDrawingsTab);
  }
  if (mobTabDrawingsTrigger) {
    mobTabDrawingsTrigger.addEventListener('click', redirectToDrawingsTab);
  }

  if (mobTabTasksTrigger) {
    mobTabTasksTrigger.addEventListener('click', () => {
      switchTab('tasks');
      showToast("Loading active detailed tasks list...", "info");
    });
  }

  // Initialize estimates
  updateProposalEstimates();
  updateCanvasTransform();

  // Listen to hash changes in the URL bar for navigation
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash && hash !== state.activeTab) {
      switchTab(hash, false);
    }
  });

  // Initial routing on page load
  const initialHash = window.location.hash.substring(1);
  if (initialHash) {
    switchTab(initialHash, false);
  } else {
    // If no hash in URL, switch to dashboard and update hash
    switchTab('dashboard', true);
  }
});
