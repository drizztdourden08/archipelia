/* @layer renderer-app @kind hook */
import { useState } from 'react';

const useOptionsView = () => {
  const [tab, setTab] = useState('');
  const [query, setQuery] = useState('');
  return { query, setQuery, setTab, tab };
};

export { useOptionsView };
