import React, { useState, useEffect, useRef } from 'react';
import { adminApi } from '../../api/admin';
import { Button } from '../../components/ui/button';
import { Search, Upload, Trash2, Edit2, FileText, CheckCircle, XCircle } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function AdminEpubManagement() {
  const [documents, setDocuments] = useState([]);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTask, setUploadTask] = useState(null);
  
  // Edit state
  const [editingDoc, setEditingDoc] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef(null);

  const fetchDocs = async (currentPage = 1, searchQuery = search) => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * ITEMS_PER_PAGE;
      const data = await adminApi.getDocuments(skip, ITEMS_PER_PAGE, searchQuery);
      if (Array.isArray(data)) {
        setDocuments(data);
        setTotalDocuments(data.length);
      }
    } catch (e) {
      console.error('Failed to fetch documents', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs(page, search);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDocs(1, search);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete document "${title}"?`)) {
      try {
        await adminApi.deleteDocument(id);
        fetchDocs(page, search);
      } catch (e) {
        alert(e.response?.data?.detail || 'Failed to delete');
      }
    }
  };

  const handleEditClick = (doc) => {
    setEditingDoc(doc.book_id);
    setEditTitle(doc.title || '');
    setEditAuthor(doc.author || '');
  };

  const handleSaveEdit = async () => {
    try {
      setIsEditing(true);
      await adminApi.updateDocument(editingDoc, { title: editTitle, author: editAuthor });
      setEditingDoc(null);
      fetchDocs(page, search);
    } catch (e) {
      alert(e.response?.data?.detail || 'Failed to update');
    } finally {
      setIsEditing(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadTask({ status: 'UPLOADING', progress: 0, total_chunks: 0 });
      
      const res = await adminApi.importDocument(file, '', '');
      if (res.task_id) {
        pollTask(res.task_id);
      } else {
        fetchDocs(page, search);
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload document');
      setIsUploading(false);
      setUploadTask(null);
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const pollTask = async (taskId) => {
    const interval = setInterval(async () => {
      try {
        const taskStatus = await adminApi.getDocumentTask(taskId);
        setUploadTask(taskStatus);
        
        if (taskStatus.status === 'COMPLETED' || taskStatus.status === 'FAILED') {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadTask(null);
            fetchDocs(page, search);
          }, 2000);
        }
      } catch (e) {
        console.error('Failed to poll task', e);
        clearInterval(interval);
        setIsUploading(false);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search title or author..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary">Search</Button>
        </form>
        
        <div>
          <input
            type="file"
            accept=".epub"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading}
            className="gap-2"
          >
            <Upload size={16} />
            {isUploading ? 'Uploading...' : 'Upload EPUB'}
          </Button>
        </div>
      </div>

      {isUploading && uploadTask && (
        <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            {uploadTask.status === 'COMPLETED' ? (
              <CheckCircle className="text-emerald-500 animate-bounce" size={24} />
            ) : uploadTask.status === 'FAILED' ? (
              <XCircle className="text-destructive" size={24} />
            ) : (
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
            <div>
              <p className="text-sm font-semibold text-foreground">
                {uploadTask.status === 'COMPLETED' ? 'Upload Completed' : 
                 uploadTask.status === 'FAILED' ? 'Upload Failed' : 
                 'Processing Document...'}
              </p>
              <p className="text-xs text-muted-foreground">
                {uploadTask.status} 
                {uploadTask.total_chunks > 0 && ` - Progress: ${uploadTask.progress} / ${uploadTask.total_chunks} chunks`}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-border/80 bg-card">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border/50 text-muted-foreground font-medium">
              <th className="p-4 pl-6">Title</th>
              <th className="p-4">Author</th>
              <th className="p-4">Chunks</th>
              <th className="p-4">Model</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-muted-foreground">Loading documents...</td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-muted-foreground">No documents found.</td>
              </tr>
            ) : (
              documents.map(doc => (
                <tr key={doc.book_id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 pl-6">
                    {editingDoc === doc.book_id ? (
                      <input 
                        type="text" 
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-2 py-1 text-sm bg-background border border-input rounded-md"
                      />
                    ) : (
                      <span className="font-medium flex items-center gap-2 text-foreground">
                        <FileText size={14} className="text-muted-foreground" />
                        {doc.title || 'Untitled'}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {editingDoc === doc.book_id ? (
                      <input 
                        type="text" 
                        value={editAuthor}
                        onChange={(e) => setEditAuthor(e.target.value)}
                        className="w-full px-2 py-1 text-sm bg-background border border-input rounded-md"
                      />
                    ) : (
                      <span className="text-muted-foreground">{doc.author || '-'}</span>
                    )}
                  </td>
                  <td className="p-4 text-muted-foreground font-semibold">{doc.total_chunks || 0}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-mono text-muted-foreground">{doc.embedding_model}</span>
                      {doc.is_embedding_current ? (
                        <span className="text-[10px] text-emerald-500 font-medium">Current</span>
                      ) : (
                        <span className="text-[10px] text-amber-500 font-medium">Stale</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right flex justify-end gap-2">
                    {editingDoc === doc.book_id ? (
                      <>
                        <Button variant="default" size="sm" className="h-8" onClick={handleSaveEdit} disabled={isEditing}>Save</Button>
                        <Button variant="outline" size="sm" className="h-8" onClick={() => setEditingDoc(null)} disabled={isEditing}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" onClick={() => handleEditClick(doc)}>
                          <Edit2 size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(doc.book_id, doc.title)}>
                          <Trash2 size={14} />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center px-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-xs text-muted-foreground">Page {page}</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setPage(p => p + 1)}
          disabled={documents.length < ITEMS_PER_PAGE}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
