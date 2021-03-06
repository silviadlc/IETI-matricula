<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="terms">
        <table>
            <caption>Llistat de cursos</caption>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Descripció</th>
                    <th>Data d'inici</th>
                    <th>Data de finalització</th>
                    <th>Creació</th>
                    <th>Darrera modificació</th>
                    <th>Editar</th>
                    <th>Eliminar</th>
                </tr>
            </thead>
            <tbody style="display: none">
            </tbody>
            <tfoot>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Descripció</th>
                    <th>Data d'inici</th>
                    <th>Data de finalització</th>
                    <th>Creació</th>
                    <th>Darrera modificació</th>
                    <th>Editar</th>
                    <th>Eliminar</th>
                </tr>
            </tfoot>
        </table>
        <div class="bg-dialog"></div>
        <div class="modal-term dis-none" title="Nou Curs">
            <div class="label-group">
                <label for="name">Nom:</label>
                <input type="text" id="name" class="input">
            </div>
            <div class="label-group">
                <label for="description">Descripció:</label>
                <input type="text" id="description" class="input">
            </div>
            <div class="row">
                <div class="label-group">
                    <label for="start">Data d'inici:</label>
                    <input type="text" id="start" class="input">
                </div>
                <div class="label-group">
                    <label for="end">Data de finalització:</label>
                    <input type="text" id="end" class="input">
                </div>
            </div>
        </div>

    </div>
</x-app-layout>
